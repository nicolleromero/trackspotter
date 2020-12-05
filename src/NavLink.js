import React from 'react';
import { useLocation } from 'react-router-dom'; // Removed Link import from here
import { createLocation } from 'history';

import { Link } from './RouterDebugger/Link';

const resolveToLocation = (to, currentLocation) =>
  typeof to === "function" ? to(currentLocation) : to;

const normalizeToLocation = (to, currentLocation) => {
  return typeof to === "string"
    ? createLocation(to, null, null, currentLocation)
    : to;
};

function getLocationId({ pathname, search, hash }) {
  return pathname + (search ? "?" + search : "") + (hash ? "#" + hash : "");
}

export function NavLink(props) {
  const location = useLocation();
  const to = normalizeToLocation(
    resolveToLocation(props.to, location),
    location
  );

  return (
    <Link
      {...props}
      replace={getLocationId(to) === getLocationId(location)}
    />
  )
}
