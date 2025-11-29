import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationComponent({ pagination, url, currentPage }) {
  return (
    <Pagination>
      <PaginationContent>
        {pagination.prev && (
          <PaginationItem>
            <PaginationPrevious href={`${url}?page=${pagination.prev}`}>
              Previous
            </PaginationPrevious>
          </PaginationItem>
        )}
        {[...Array(pagination.totalPage)].map((_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              href={`${url}?page=${i + 1}`}
              isActive={i + 1 === currentPage}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pagination.next && (
          <PaginationItem>
            <PaginationNext href={`${url}?page=${pagination.next}`}>
              Next
            </PaginationNext>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
