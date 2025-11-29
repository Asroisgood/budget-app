"use client";
import AddTransactionButton from "./add-transaction";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AreYouSure } from "./confirm-dialog";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import PaginationComponent from "./pagination";

import { useSearchParams } from "next/navigation";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});

  const params = useSearchParams();
  const page = Number(params.get("page")) || 1;
  async function getTransaction() {
    const res = await fetch(`/api/transactions?page=${page}`, {
      method: "GET",
    });
    const data = await res.json();
    setTransactions(data.data);
    setPagination(data.pagination);
  }

  async function doDelete(id) {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success("Transaction deleted");
    getTransaction();
  }

  useEffect(() => {
    getTransaction();
  }, []);

  return (
    <>
      <AddTransactionButton onSuccess={getTransaction} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Act</TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 &&
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <AreYouSure
                    buttons={<Button variant="destructive">Delete</Button>}
                    load={getTransaction}
                    doDelete={doDelete}
                    id={transaction.id}
                  />
                </TableCell>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell
                  className={
                    transaction.category.type === "expense"
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.category.name}</TableCell>
                <TableCell>{transaction.category.type}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {transactions.length === 0 && <p>No transactions found</p>}
      {pagination && (
        <PaginationComponent
          pagination={pagination}
          url="/dashboard/transactions"
          currentPage={page}
        />
      )}
    </>
  );
}
