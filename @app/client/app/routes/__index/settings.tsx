import { NavLink, Outlet } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { useCallback, useRef } from "react";
import { IoMenu } from "react-icons/io5";

import { Warn } from "~/components";
import { useUser } from "~/utils/hooks";
import { requireUser } from "~/utils/users";

export const handle = { fullWidth: true };

export const loader = async ({ request, context }: LoaderArgs) => {
  await requireUser(request, context);
  return null;
};

export default function Settings() {
  const currentUser = useUser();

  // Note: we can't use a controlled component here because we want the default
  // behavior of the css library. We only additionally need a click on a link in
  // the drawer to close it.
  const checkboxRef = useRef<HTMLInputElement | null>(null);
  const hideDrawer = useCallback(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false;
    }
  }, []);

  return (
    <div className="drawer drawer-mobile flex-1 self-stretch">
      <input
        id="settings-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={checkboxRef}
      />
      {/* relative used to float menu button with absolute position */}
      <div className="drawer-content relative h-auto">
        <label
          htmlFor="settings-drawer"
          className="btn btn-primary btn-circle drawer-button absolute top-5 left-5 text-lg lg:hidden"
          data-cy="settingslayout-drawer-toggle"
        >
          <IoMenu />
        </label>

        <div className="m-4 flex flex-col items-center">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side lg:border-r-primary lg:border-r">
        <label htmlFor="settings-drawer" className="drawer-overlay" />
        <ul className="menu bg-base-100 text-base-content w-80 overflow-y-auto p-4">
          <li>
            <NavLink
              to="/settings"
              data-cy="settingslayout-link-profile"
              end
              onClick={hideDrawer}
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/security"
              data-cy="settingslayout-link-password"
              end
              onClick={hideDrawer}
            >
              Passphrase
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/accounts"
              data-cy="settingslayout-link-accounts"
              end
              onClick={hideDrawer}
            >
              Linked Accounts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/emails"
              data-cy="settingslayout-link-emails"
              end
              onClick={hideDrawer}
            >
              <Warn
                className="indicator-middle"
                okay={!currentUser || currentUser.isVerified}
              >
                <span className="mr-4">Emails</span>
              </Warn>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/delete"
              data-cy="settingslayout-link-delete"
              end
              onClick={hideDrawer}
            >
              Delete Account
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
