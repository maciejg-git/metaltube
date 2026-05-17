const Footer = ({updated}) => {
  return (
    <div className="bg-gray-50 dark:bg-neutral-800 text-sm">
      <div className="flex items-center justify-between px-4 py-6">
        <div>
          Last updated: {updated}
        </div>
        <div>
          <a href="https://github.com/maciejg-git/metaltube">Github</a>
        </div>
      </div>
    </div>
  )
}

export default Footer
