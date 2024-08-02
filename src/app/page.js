'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { Box, Typography, Modal, Stack, TextField, Button, Select, MenuItem, InputLabel, FormControl, Autocomplete } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, query, setDoc, getDocs } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemNameError, setItemNameError] = useState(false);
  const [itemTypeError, setItemTypeError] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const filteredSearch = inventory.filter((item) => {
    if (searchInput == "") {
      return item;
    } else {
      return item.name.includes(searchInput.toLowerCase());
    }
  });

  const updateInventory = async () => {
    const snapShot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapShot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {quantity: quantity - 1});
      };
    };

    await updateInventory();
  }

  const addItem = async (item, type) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1});
    } else {
      await setDoc(docRef, {quantity: 1});
    };

    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName("");
    setItemType("");
  }
  const handleInput = (e) => {
    console.log(e.target.value);
    setSearchInput(e.target.value);
  }

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={500} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{transform: "translate(-50%,-50%)"}}>
          <Typography variant="h6">Add Item</Typography>
          <Stack display="flex" width="100%" direction="row" spacing={2}>
            <TextField required error={itemNameError} helperText="Provide an item name" label="Name" variant="outlined" fullWidth value={itemName} onChange={(e) => {setItemName(e.target.value)}}></TextField>
            <TextField required error={itemTypeError} helperText="Select an item type" select label="Type" variant="outlined" fullWidth value={itemType} onChange={(e) => {setItemType(e.target.value)}}>
              <MenuItem value={"Perishable"}>Perishable</MenuItem>
              <MenuItem value={"Chilled"}>Chilled</MenuItem>
              <MenuItem value={"Frozen"}>Frozen</MenuItem>
              <MenuItem value={"Ambient"}>Ambient</MenuItem>
              <MenuItem value={"Misc"}>Misc</MenuItem>
            </TextField>
          </Stack>
          <Box display="flex" flexDirection="row" justifyContent="space-around">
            <Button size="large" sx={{maxWidth: "100px"}} variant="outlined" onClick={(e) => {
              if (itemName == "") {
                setItemNameError(true);
              }
              if (itemType == "") {
                setItemTypeError(true);
              }
              if (itemName && itemType) {
                addItem(itemName.toLowerCase(), itemType.toLowerCase());
                setItemName("");
                setItemType("");
                handleClose();
              }
            }}>Add</Button>
          </Box>
        </Box>
      </Modal>
      <Box width="800px" display="flex" flexDirection="row" justifyContent="space-between">
        <Autocomplete disablePortal options={inventory.map((item) => item.name.charAt(0).toUpperCase() + item.name.slice(1))} renderInput={(params) => (
          <TextField {...params} label="Search" onSelect={handleInput} sx={{width: 250, margin: "10px auto"}}></TextField>
        )}></Autocomplete>
        <Button variant="contained" size="large" onClick={() => {handleOpen()}}>Add Item</Button>
      </Box>
      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#add8e6" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="#333">Inventory Items</Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {
          filteredSearch.map(({name, quantity}) => (
            <Box key={name} width="100%" minHeight="150px" display="flex" justifyContent="space-between" padding={5}>
              <Typography variant="h3" color="#333" width="300px">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h3" color="#333">{quantity}</Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" size="large" onClick={() => {addItem(name.toLowerCase())}}>Add</Button>
                <Button variant="contained" size="large" onClick={() => {removeItem(name.toLowerCase())}}>Remove</Button>
              </Stack>
            </Box>
          ))
        }
      </Stack>
      </Box>
    </Box>
  );
}
