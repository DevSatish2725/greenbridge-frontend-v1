"use client";

import {
  LogIn,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";

interface GuestCallModalProps {
  sellerName: string;
  onClose: () => void;
  onLogin: () => void;
}

export default function GuestCallModal({
  sellerName,
  onClose,
  onLogin,
}: GuestCallModalProps) {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        px-4
        backdrop-blur-[2px]
      "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-call-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          relative
          w-full max-w-sm
          rounded-2xl
          border border-border
          bg-surface
          p-5
          shadow-xl
        "
      >
        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute right-3 top-3
            flex h-9 w-9
            items-center justify-center
            rounded-full
            text-text-muted
            transition-colors
            hover:bg-surface-muted
            hover:text-text-primary
          "
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}

        <div
          className="
            mx-auto
            flex h-14 w-14
            items-center justify-center
            rounded-full
            bg-primary-light
            text-primary
          "
        >
          <Phone className="h-6 w-6" />
        </div>

        {/* Content */}

        <div className="mt-4 text-center">
          <h2
            id="guest-call-title"
            className="
              text-xl font-bold
              text-text-primary
            "
          >
            Login to Call Seller
          </h2>

          <p
            className="
              mt-2
              text-sm leading-6
              text-text-secondary
            "
          >
            Sign in with your mobile number
            to contact{" "}
            <span
              className="
                font-semibold
                text-text-primary
              "
            >
              {sellerName}
            </span>
            .
          </p>
        </div>

        {/* Trust message */}

        <div
          className="
            mt-5
            flex items-start gap-3
            rounded-xl
            bg-primary-light
            p-3
          "
        >
          <ShieldCheck
            className="
              mt-0.5 h-5 w-5
              shrink-0 text-primary
            "
          />

          <div>
            <p
              className="
                text-sm font-semibold
                text-text-primary
              "
            >
              Seller contact is protected
            </p>

            <p
              className="
                mt-0.5
                text-xs leading-5
                text-text-secondary
              "
            >
              Contact details are available
              only after login.
            </p>
          </div>
        </div>

        {/* Primary action */}

        <button
          type="button"
          onClick={onLogin}
          className="
            mt-5
            flex min-h-12
            w-full items-center
            justify-center gap-2
            rounded-xl
            bg-primary
            px-4
            text-sm font-bold
            text-white
            transition-colors
            hover:bg-primary-hover
          "
        >
          <LogIn className="h-5 w-5" />

          Login to Call
        </button>

        {/* Secondary action */}

        <button
          type="button"
          onClick={onClose}
          className="
            mt-2
            min-h-11 w-full
            rounded-xl
            text-sm font-semibold
            text-text-secondary
            transition-colors
            hover:bg-surface-muted
            hover:text-text-primary
          "
        >
          Not Now
        </button>
      </div>
    </div>
  );
}