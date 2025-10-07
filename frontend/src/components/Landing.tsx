import React from 'react';

import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ArrowRight, Menu, Rocket, X } from 'lucide-react';
import { Button } from './ui/Button';



const Landing: React.FC = () => {
  const [menuState, setMenuState] = React.useState(false);

  return (
    <>
      <header>
        <nav
          data-state={menuState ? 'active' : ''}
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link
                  to="/"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <Logo />
                </Link>
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu
                    className={`m-auto size-6 duration-200 ${menuState ? 'rotate-180 scale-0 opacity-0' : ''
                      }`}
                  />
                  <X
                    className={`absolute inset-0 m-auto size-6 duration-200 ${menuState ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'
                      }`}
                  />
                </button>
              </div>
              <div
                className={`bg-white mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent ${menuState ? 'block lg:flex' : 'hidden lg:flex'
                  }`}
              >

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button variant="outline" size="sm">
                    <Link to="/verify">
                      <span>Verify</span>
                    </Link>
                  </Button>
                  <Button size="sm">
                    <Link to="/issue">
                      <span>Issue</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="overflow-hidden">
        <section className="relative">
          <div className="relative py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                <Link
                  to="/"
                  className="rounded-lg mx-auto flex w-fit items-center gap-2 border p-1 pr-3"
                >
                  <span className="bg-gray-100 rounded-md px-2 py-1 text-xs">New</span>
                  <span className="text-sm">Kube Credential System</span>
                  <span className="bg-gray-300 block h-4 w-px"></span>
                  <ArrowRight className="size-4" />
                </Link>
                <h1 className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:leading-tight">
                  Kube Credential <br /> Management System
                </h1>
                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">
                  A microservice-based credential management system with independent issuance and verification services,
                  built with Node.js, TypeScript, and containerized for Kubernetes deployment.
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
                  Microservice-based credential platform with scalable issuance and verification services.
                </p>
                <div className="mt-8">
                  <Button size="lg">
                    <Link to="/issue" className="flex items-center gap-2">
                      <Rocket className="relative size-4" />
                      <span className="text-nowrap">Issue Credential</span>
                    </Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
};



export default Landing;