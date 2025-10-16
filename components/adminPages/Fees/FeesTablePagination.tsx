

"use client"

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
};

const FeesTablePagination = ({ page, pageSize, totalItems }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalItems);

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(newPage));
    params.set("pageSize", String(pageSize));
    const query = params.toString();
    router.push(`${window.location.pathname}?${query}`);
  };

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-sm text-muted-foreground">
        Showing {totalItems === 0 ? 0 : startIndex}-{endIndex} of {totalItems}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default FeesTablePagination;
