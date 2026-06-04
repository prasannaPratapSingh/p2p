type GlobalLoaderProps = {
    fullScreen?: boolean;
};

const GlobalLoader = ({ fullScreen = false }: GlobalLoaderProps) => {
    return (
        <div className={fullScreen ? "fixed inset-0 z-50 grid place-items-center bg-slate-950/95" : "fixed bottom-6 right-6 z-50"}>
            <div className="inline-flex items-center justify-center rounded-full bg-slate-900/90 p-3 shadow-lg border border-slate-700">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
            </div>
        </div>
    );
};

export default GlobalLoader;
