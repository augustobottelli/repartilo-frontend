"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { MessageSquare, Truck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function AppTopbar() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;

    setSending(true);

    // Create mailto link
    const subject = encodeURIComponent("Repartilo Feedback");
    const body = encodeURIComponent(feedback);
    window.location.href = `mailto:support@repartilo.com?subject=${subject}&body=${body}`;

    // Reset
    setTimeout(() => {
      setFeedback("");
      setShowFeedback(false);
      setSending(false);
    }, 1000);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Repartilo</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
        {/* Feedback Button */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFeedback(!showFeedback)}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Feedback
          </Button>

          {showFeedback && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
              <h3 className="font-semibold mb-2">Send us feedback</h3>
              <p className="text-sm text-gray-600 mb-3">
                Having issues or suggestions? Let us know!
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type your feedback here..."
                className="w-full border border-gray-300 rounded-lg p-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleSendFeedback}
                  disabled={!feedback.trim() || sending}
                  loading={sending}
                  className="flex-1"
                >
                  Send
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowFeedback(false);
                    setFeedback("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

          {/* User Button */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
