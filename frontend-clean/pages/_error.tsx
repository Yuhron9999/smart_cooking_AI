import React from 'react';
import { NextPageContext } from 'next';

interface ErrorProps {
    statusCode?: number;
    hasGetInitialPropsRun?: boolean;
    err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <div className="text-center">   
                    <h1 className="text-6xl font-bold text-gray-300 mb-4">
                        {statusCode || 'Error'}
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {statusCode
                            ? `Đã xảy ra lỗi ${statusCode} trên server`
                            : 'Đã xảy ra lỗi phía client'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Xin lỗi, có gì đó đã sai. Vui lòng thử lại sau.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        </div>
    );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
