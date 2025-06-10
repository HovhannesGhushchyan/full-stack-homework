import { useRef, useCallback } from 'react';

export function useMemoizedValue<T>(
    computeFn: () => T,
    dependencies: any[],
    cacheSize: number = 10
): T {
    const cache = useRef<Map<string, T>>(new Map());
    const lastDeps = useRef<any[]>([]);

    return useCallback(() => {
        const depsKey = JSON.stringify(dependencies);

        // Check if dependencies have changed
        const depsChanged = dependencies.some(
            (dep, index) => dep !== lastDeps.current[index]
        );

        if (!depsChanged && cache.current.has(depsKey)) {
            return cache.current.get(depsKey)!;
        }

        // Compute new value
        const newValue = computeFn();

        // Update cache
        if (cache.current.size >= cacheSize) {
            // Remove oldest entry
            const firstKey = Array.from(cache.current.keys())[0];
            if (firstKey) {
                cache.current.delete(firstKey);
            }
        }

        cache.current.set(depsKey, newValue);
        lastDeps.current = dependencies;

        return newValue;
    }, dependencies)();
}