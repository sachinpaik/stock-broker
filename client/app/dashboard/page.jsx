import React from 'react';
import Sidebar from "@/app/_components/sidebar";

const Page = () => {
    return (
        <div className='h-screen flex'>
            <div className='w-2/5 '>
                <Sidebar/>
            </div>
            <div className='w-4/5'>
                <div className='h-1/2 '>
                    <h1 className='text-4xl'>Portfolio</h1>
                </div>
                <div className='h-1/2'>
                    <h1 className='text-4xl '>Chart</h1>
                </div>
            </div>
        </div>
    );
};

export default Page;