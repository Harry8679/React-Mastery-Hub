import { useEffect } from 'react';
import type { ComponentType } from 'react';

// HOC withLogger - Log les props et lifecycle
export function withLogger<P extends object>(
  Component: ComponentType<P>,
  componentName: string
) {
  return function LoggedComponent(props: P) {
    useEffect(() => {
      console.log(`🟢 [${componentName}] Mounted`);
      console.log(`📊 [${componentName}] Props:`, props);

      return () => {
        console.log(`🔴 [${componentName}] Unmounted`);
      };
    }, [props]);

    useEffect(() => {
      console.log(`🔄 [${componentName}] Updated with props:`, props);
    });

    return <Component {...props} />;
  };
}