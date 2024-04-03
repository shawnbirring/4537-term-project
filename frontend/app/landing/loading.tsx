export default function FullScreenLoading() {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 z-50">
            <div className="animate-pulse bg-gray-400 rounded-full w-10 h-10"></div>
        </div>
    );
};