"use client";

import { useEffect, useState } from "react";
import AddCategoryButton from "./add-category";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AreYouSure } from "./confirm-dialog";
import { toast } from "sonner";

export default function CategoriesPages() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/categories", { method: "GET" });
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  async function doDelete(id) {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();

    toast.success("Category deleted");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <AddCategoryButton
        onSuccess={() => {
          load();
          toast.success("New Category Added");
        }}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Act</TableHead>
            <TableHead className="px-6 text-center">Id</TableHead>
            <TableHead className="px-6 text-center">Category Name</TableHead>
            <TableHead className="px-6 text-center">Category Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">
                <AreYouSure
                  buttons={<Button variant="destructive">Delete</Button>}
                  load={load}
                  doDelete={doDelete}
                  id={item.id}
                />
              </TableCell>
              <TableCell className="px-4 text-center">{item.id}</TableCell>
              <TableCell className="px-4">{item.name}</TableCell>
              <TableCell className="px-4 text-center">{item.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
