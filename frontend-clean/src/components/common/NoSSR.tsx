import dynamic from 'next/dynamic';
import React from 'react';

const NoSSR = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default dynamic(() => Promise.resolve(NoSSR), {
    ssr: false,
    loading: () => (
        <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
    )
});
