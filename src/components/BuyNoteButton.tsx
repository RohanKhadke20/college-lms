'use client';

import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, Loader2 } from 'lucide-react';

interface BuyNoteButtonProps {
  noteId: string;
  noteTitle: string;
  price: number;
  isPremium?: boolean;
  onSuccess?: (noteId: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showPrice?: boolean;
}

// Utility to load Razorpay checkout script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    // Check if script is already present on window
    const win = window as unknown as { Razorpay?: unknown };
    if (win.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const BuyNoteButton: React.FC<BuyNoteButtonProps> = ({
  noteId,
  noteTitle,
  price,
  isPremium = true,
  onSuccess,
  className = '',
  size = 'md',
  fullWidth = false,
  showPrice = true,
}) => {
  const isFree = !isPremium || price === 0;
  const [unlockedLocally, setUnlockedLocally] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isUnlocked = isFree || unlockedLocally;

  // Check if note was previously unlocked
  useEffect(() => {
    try {
      const stored = localStorage.getItem('campus_unlocked_notes');
      if (stored) {
        const unlockedList: string[] = JSON.parse(stored);
        if (unlockedList.includes(noteId)) {
          Promise.resolve().then(() => {
            setUnlockedLocally(true);
          });
        }
      }
    } catch {
      // LocalStorage access fallback
    }

    const handleUnlockEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ noteId: string }>;
      if (customEvent.detail?.noteId === noteId) {
        setUnlockedLocally(true);
      }
    };

    window.addEventListener('campus-note-unlocked', handleUnlockEvent);
    return () => {
      window.removeEventListener('campus-note-unlocked', handleUnlockEvent);
    };
  }, [noteId]);

  const handleCheckout = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (isUnlocked) {
      onSuccess?.(noteId);
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Unable to initialize Razorpay payment gateway. Please check your internet connection.');
      }

      // 2. Call order API route to create Razorpay Order
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          amount: price,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      const keyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        orderData.keyId ||
        'rzp_test_Tdn6uzZbDDLGBB';

      // 3. Configure Razorpay checkout options
      type RazorpayResponse = {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      };

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'CampusOS Academic LMS',
        description: `Unlock Full Notes: ${noteTitle}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png',
        order_id: orderData.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            setLoading(true);
            // 4. Call verify API route
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                noteId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            // 5. Unlock note access locally and notify listeners
            setUnlockedLocally(true);
            try {
              const currentUnlocked = JSON.parse(
                localStorage.getItem('campus_unlocked_notes') || '[]'
              );
              if (!currentUnlocked.includes(noteId)) {
                currentUnlocked.push(noteId);
                localStorage.setItem('campus_unlocked_notes', JSON.stringify(currentUnlocked));
              }
            } catch {
              // Ignore localStorage write error
            }

            window.dispatchEvent(
              new CustomEvent('campus-note-unlocked', { detail: { noteId } })
            );

            onSuccess?.(noteId);
          } catch (err: unknown) {
            console.error('Verification error:', err);
            const msg = err instanceof Error ? err.message : 'Error validating payment.';
            setErrorMessage(msg);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: 'Student Member',
          email: 'student@college.edu',
          contact: '9876543210',
        },
        notes: {
          noteId,
          environment: 'Test Mode',
        },
        theme: {
          color: '#4F46E5', // Indigo-600
          backdrop_color: '#090D16',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // 4. Open Razorpay Checkout modal
      const win = window as unknown as { Razorpay: new (opts: typeof options) => { open: () => void } };
      const razorpayInstance = new win.Razorpay(options);
      razorpayInstance.open();
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to launch checkout.';
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  // Button sizing
  const sizeClasses = {
    sm: 'text-[11px] py-1 px-2.5 gap-1',
    md: 'text-xs py-1.5 px-3 gap-1.5',
    lg: 'text-sm py-2 px-4 gap-2',
  }[size];

  if (isUnlocked) {
    return (
      <button
        type="button"
        onClick={() => onSuccess?.(noteId)}
        className={`inline-flex items-center justify-center font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-pointer transition-colors hover:bg-emerald-500/20 ${sizeClasses} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        title="Note is unlocked! Click to view or download."
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Unlocked</span>
      </button>
    );
  }

  return (
    <div className={`inline-flex flex-col ${fullWidth ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={`inline-flex items-center justify-center font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-white shadow-sm shadow-amber-500/20 transition-all cursor-pointer transform active:scale-95 ${sizeClasses} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        title={`Unlock ${noteTitle} in Razorpay Test Mode`}
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Lock className="h-3.5 w-3.5" />
            <span>Unlock Note</span>
            {showPrice && (
              <span className="font-mono bg-black/25 px-1.5 py-0.5 rounded text-[10px]">
                ₹{price}
              </span>
            )}
          </>
        )}
      </button>

      {errorMessage && (
        <span className="text-[10px] text-rose-400 mt-1 line-clamp-1 text-center">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default BuyNoteButton;
