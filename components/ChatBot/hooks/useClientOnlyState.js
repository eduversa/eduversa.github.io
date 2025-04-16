import { useState, useEffect } from "react";

function useClientOnlyState(initialValue) {
  const [state, setState] = useState(initialValue);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return [state, setState, hasMounted];
}

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default useClientOnlyState;
