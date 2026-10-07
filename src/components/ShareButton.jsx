export default function ShareButton({ onShare, isCopied }) {
  return (
    <button
      type="button"
      onClick={onShare}
      className={`glass rounded-xl p-2.5 transition-all flex items-center justify-center ${
        isCopied ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
      title={isCopied ? "Link copied!" : "Share current weather"}
      aria-label="Share current weather report"
    >
      {isCopied ? (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
    </button>
  );
}
