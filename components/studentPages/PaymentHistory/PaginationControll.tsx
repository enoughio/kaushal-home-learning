"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  start: number;
  end: number;
  total: number;
};

// this should only update the query param `page`
export default function PaginationControll({ page, start, end, total }: Props) {
  const serchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const onNextPage = () => {
    const params = new URLSearchParams(serchParams?.toString() || "");
    params.set("page", (page + 1).toString());
  };

  const onPrevPage = () => {
    const params = new URLSearchParams(serchParams?.toString() || "");
    params.set("page", Math.max(1, page - 1).toString());

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        Showing {start}-{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            onPrevPage();
          }}
          className={`px-3 py-1 rounded bg-muted hover:bg-muted/80 ${
            page === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Previous
        </Button>
        <span className="text-sm">{page}</span>
        <Button
          onClick={() => {
            onNextPage();
          }}
          className={`px-3 py-1 rounded bg-muted hover:bg-muted/80 ${
            page >= total ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
