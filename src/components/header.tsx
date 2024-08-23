import { Search, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  // Add any props you want to pass to the Header component
}

const Header = (props: HeaderProps) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white bg-opacity-10 backdrop-blur-md">
      <div className="text-2xl font-bold flex items-center">
        <Sparkles className="mr-2" />
        AI Tutor
      </div>
      <div className="flex items-center space-x-4">
        <w3m-button />
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-purple-300" />
          <input
            type="search"
            placeholder="Search tutors"
            className="pl-8 bg-white bg-opacity-20 border-purple-300 placeholder-purple-300 text-white"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
