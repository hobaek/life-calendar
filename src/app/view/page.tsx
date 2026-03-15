"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { decodeSubjectFromUrl } from "@/lib/storage";

export default function SharedViewPage() {
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
