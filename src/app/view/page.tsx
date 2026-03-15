"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { decodeSubjectFromUrl } from "@/lib/storage";

function SharedViewInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) { router.push("/dashboard"); return; }
    const decoded = decodeSubjectFromUrl(data);
    if (!decoded) { router.push("/dashboard"); return; }
    router.replace(`/view/${decoded.id}?data=${data}`);
  }, [searchParams, router]);

  return null;
}

export default function SharedViewPage() {
  return (
    <Suspense>
      <SharedViewInner />
    </Suspense>
  );
}
