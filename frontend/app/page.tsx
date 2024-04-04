import TypeAnimation from "@/components/TypeAnimation";
import { strings } from "@/lang/en/userfacingstrings";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <TypeAnimation
        className="text-5xl font-bold text-gray-800"
        sequence={[strings.home.welcome_msg]}
      />
      <p className="mt-3 text-lg text-gray-600">
        {strings.home.creators_subheading}
      </p>

      <div className="mt-10">
        <Link
          href="/login"
          className="px-6 py-3 mr-4 text-white bg-blue-500 rounded-md shadow hover:bg-blue-700 transition-colors duration-200 ease-in-out"
        >
          {strings.home.login_button_description}
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 text-blue-500 border border-blue-500 rounded-md shadow hover:bg-blue-50 transition-colors duration-200 ease-in-out"
        >
           {strings.home.register_button_label}
        </Link>
      </div>
    </div>
  );
}
