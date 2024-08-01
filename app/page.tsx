"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { firestore } from "@/firebase";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

const pantryItems = ["Apples", "Bananas", "Oranges", "Grapes", "Strawberries"];
interface InventoryItem {
  name: string;
  quantity: number;
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [filterItems, setFilterItems] = useState<string | undefined>("");

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => item.name.toLowerCase().includes(filterItems?.toLowerCase() ?? ""));
  }, [inventory, filterItems]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList: InventoryItem[] = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        quantity: doc.data().quantity,
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item: string) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 });
        await updateInventory();
      } else {
        await deleteDoc(docRef);
        await updateInventory();
      }
    }
  };

  const addItem = async (item: string) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
      await updateInventory();
    } else {
      await setDoc(docRef, { quantity: 1 });
      await updateInventory();
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <main className="flex flex-col gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-2">
          <Input
            type="text"
            value={filterItems}
            onChange={(e) => setFilterItems(e.target.value)}
            placeholder="Search product"
          />
          <DialogTrigger asChild>
            <Button>Add Item</Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>Enter the name of the item you want to add to your pantry.</DialogDescription>
          </DialogHeader>
          <Input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
          <DialogFooter>
            <Button
              onClick={() => {
                addItem(itemName);
                setOpen(false);
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="text-center py-6">
        <h1 className="text-xl font-medium">Pantry Items</h1>
        <ul className="divide-y max-h-40 overflow-auto text-center mt-2">
          {filteredItems.map((item) => (
            <li key={item.name} className="py-1">
              {firstLetterUpperCase(item.name)} - {item.quantity} -{" "}
              <Button onClick={() => addItem(item.name)}>Add</Button> -{" "}
              <Button onClick={() => removeItem(item.name)} variant="destructive">
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}

// First letter uppercase
const firstLetterUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
