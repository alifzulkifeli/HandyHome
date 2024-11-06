"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const values = [
    {
        value: "johor",
        label: "Johor",
    },
    {
        value: "sabah",
        label: "Sabah",
    },
    {
        value: "perak",
        label: "Perak",
    },
    {
        value: "pulau pinang",
        label: "Pulau Pinang",
    },
    {
        value: "selangor",
        label: "Selangor",
    },
    {
        value: "sarawak",
        label: "Sarawak",
    },
    {
        value: "terengganu",
        label: "Terengganu",
    },
    {
        value: "kuala lumpur",
        label: "Kuala Lumpur",
    },
    {
        value: "negeri sembilan",
        label: "Negeri Sembilan",
    },
    {
        value: "melaka",
        label: "Melaka",
    },
    {
        value: "labuan",
        label: "Labuan",
    },
    {
        value: "kelantan",
        label: "Kelantan",
    },
    {
        value: "kedah",
        label: "Kedah",
    },
    {
        value: "perlis",
        label: "Perlis",
    },
    {
        value: "putrajaya",
        label: "Putrajaya",
    },
    {
        value: "pahang",
        label: "Pahang",
    }
];
        


const State = () => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    
    
    

    return (
        <div className={`w-1/3 mr-2 pb-2 ` } >

            <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? values.find((framework) => framework.value === value)?.label
                            :  "State..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                    <Command>
                        <CommandInput placeholder="Search State..." />
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {values.map((framework) => (
                                    <CommandItem
                                        key={framework.value}
                                        value={framework.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === framework.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {framework.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
};

export default State;
