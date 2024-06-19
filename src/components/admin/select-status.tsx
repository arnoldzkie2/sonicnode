'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ORDERSTATUS } from '@/constant/status'

const SelectStatus = ({ status }: { status: string }) => {

    const router = useRouter()

    return (
        <Select value={status} onValueChange={(val) => router.push(`/admin/${val}`)}>
            <SelectTrigger className="w-[180px] uppercase">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {Object.keys(ORDERSTATUS).map((status, i) => (
                        <SelectItem key={i} value={status} className='uppercase'>{status}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default SelectStatus