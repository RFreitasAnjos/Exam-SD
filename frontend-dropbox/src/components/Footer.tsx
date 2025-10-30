function Footer() {
   return (
      <footer className="py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Dropbox Clone. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Powered by</span>
            <span className="text-sm font-medium text-gray-600">Renan dos Clones</span>
          </div>
        </div>
      </footer>
   );
}
export default Footer;