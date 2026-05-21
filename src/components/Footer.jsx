import BGithub from "../icons/BGithub";

const Footer = ({ updated }) => {
  return (
    <div className="bg-gray-50 text-sm dark:bg-neutral-800">
      <div className="flex items-center justify-between px-4 py-6">
        <div>
          Last updated: <span className="font-mono">{updated}</span>
        </div>
        <div>
          <a href="https://github.com/maciejg-git/metaltube">
            <BGithub className="h-6 w-6"></BGithub>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
