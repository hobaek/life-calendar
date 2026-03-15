"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Subject } from "@/lib/types";
import { encodeSubjectForUrl } from "@/lib/storage";

export default function ShareButton({ subject }: { subject: Subject }) {
  const t = useTranslations("detail");
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const encoded = encodeSubjectForUrl(subject);
    const url = `${window.location.origin}/view?data=${encoded}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="px-5 py-2 rounded-[20px] bg-lavender-light text-lavender text-[13px] font-semibold hover:opacity-80 transition-all"
    >
      {copied ? `✓ ${t("copied")}` : `🔗 ${t("share")}`}
    </button>
  );
}
