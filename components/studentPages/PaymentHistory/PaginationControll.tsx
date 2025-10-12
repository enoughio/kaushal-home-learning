

import Link from "next/link";

type Props = {
  page: number;
  pageSize: number;
  total: number;
};

export default function PaginationControll({ page, pageSize, total }: Props) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        Showing {start}-{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={`?page=${Math.max(1, page - 1)}`}
          className={`px-3 py-1 rounded bg-muted hover:bg-muted/80 ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}
        >
          Previous
        </Link>
        <span className="text-sm">{page}</span>
        <Link
          href={`?page=${page * pageSize < total ? page + 1 : page}`}
          className={`px-3 py-1 rounded bg-muted hover:bg-muted/80 ${page * pageSize >= total ? "opacity-50 pointer-events-none" : ""}`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}