import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
  const user = usePage().props.auth.user;
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(
    false
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <Link href="/">
                  <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                </Link>
              </div>
              <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                {user.role === "admin" && (
                  <NavLink
                    href={route("users.index")}
                    active={route().current("users.*")}
                  >
                    User Management
                  </NavLink>
                )}
                <NavLink
                  href={route("dashboard")}
                  active={route().current("dashboard")}
                >
                  Dashboard
                </NavLink>
                {/* Dropdown Master */}
               <Dropdown>
  <Dropdown.Trigger>
    <span
      className="inline-flex items-center border-b-2 px-1 pt-6 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 cursor-pointer"
    >
      Master
      <svg className="ms-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Link href={route("products.index")}>Products</Dropdown.Link>
    <Dropdown.Link href={route("customers.index")}>Customers</Dropdown.Link>
    <Dropdown.Link href={route("services.index")}>Services</Dropdown.Link>
    <Dropdown.Link href={route("expenses.index")}>Expenses</Dropdown.Link>
  </Dropdown.Content>
</Dropdown>

<Dropdown>
  <Dropdown.Trigger>
    <span
      className="inline-flex items-center border-b-2 px-1 pt-6 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 cursor-pointer"
    >
      Laporan
      <svg className="ms-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Link href={route("reports.transactions")}>Laporan Transaksi</Dropdown.Link>
    <Dropdown.Link href={route("jobs.report")}>Laporan Pekerjaan</Dropdown.Link>
    <Dropdown.Link href={route("reports.newreport")}>
  Laporan Baru
</Dropdown.Link>
  </Dropdown.Content>
</Dropdown>
                <NavLink
                  href={route("transactions.index")}
                  active={route().current("transactions.*")}
                >
                  Transactions
                </NavLink>
                <NavLink
                  href={route("jobs.index")}
                  active={route().current("jobs.*")}
                >
                  Jobs
                </NavLink>
              </div>
            </div>
            <div className="hidden sm:ms-6 sm:flex sm:items-center">
              <div className="relative ms-3">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                      >
                        {user.name}
                        <svg
                          className="-me-0.5 ms-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    <Dropdown.Link href={route("profile.edit")}>
                      Profile
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route("logout")}
                      method="post"
                      as="button"
                    >
                      Log Out
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>
            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() =>
                  setShowingNavigationDropdown(
                    (previousState) => !previousState
                  )
                }
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={
                      !showingNavigationDropdown ? "inline-flex" : "hidden"
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={
                      showingNavigationDropdown ? "inline-flex" : "hidden"
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Responsive menu */}
        <div
          className={
            (showingNavigationDropdown ? "block" : "hidden") + " sm:hidden"
          }
        >
          <div className="space-y-1 pb-3 pt-2">
            <ResponsiveNavLink
              href={route("dashboard")}
              active={route().current("dashboard")}
            >
              Dashboard
            </ResponsiveNavLink>
          </div>
          {/* Responsive Master Dropdown */}
          <div className="px-4">
            <div className="font-semibold text-gray-700 mt-2">Master</div>
            <ResponsiveNavLink
              href={route("products.index")}
              active={route().current("products.*")}
            >
              Products
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route("customers.index")}
              active={route().current("customers.*")}
            >
              Customers
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route("services.index")}
              active={route().current("services.*")}
            >
              Services
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route("expenses.index")}
              active={route().current("expenses.*")}
            >
              Expenses
            </ResponsiveNavLink>
          </div>
          {/* Responsive Laporan Dropdown */}
          <div className="px-4">
            <div className="font-semibold text-gray-700 mt-2">Laporan</div>
            <ResponsiveNavLink
              href={route("reports.transactions")}
              active={route().current("reports.transactions")}
            >
              Laporan Transaksi
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route("jobs.report")}
              active={route().current("jobs.report")}
            >
              Laporan Pekerjaan
            </ResponsiveNavLink>
            <ResponsiveNavLink href={route("reports.newreport")}>
  Laporan Baru
</ResponsiveNavLink>
          </div>
          <ResponsiveNavLink
            href={route("transactions.index")}
            active={route().current("transactions.*")}
          >
            Transactions
          </ResponsiveNavLink>
          <ResponsiveNavLink
            href={route("jobs.index")}
            active={route().current("jobs.*")}
          >
            Jobs
          </ResponsiveNavLink>
          <div className="border-t border-gray-200 pb-1 pt-4">
            <div className="px-4">
              <div className="text-base font-medium text-gray-800">
                {user.name}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {user.email}
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {user.role === "admin" && (
                <ResponsiveNavLink
                  href={route("users.index")}
                  active={route().current("users.*")}
                >
                  User Management
                </ResponsiveNavLink>
              )}
              <ResponsiveNavLink href={route("profile.edit")}>
                Profile
              </ResponsiveNavLink>
              <ResponsiveNavLink
                method="post"
                href={route("logout")}
                as="button"
              >
                Log Out
              </ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav>
      {header && (
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}
      <main> {children} </main>
    </div>
  );
}
