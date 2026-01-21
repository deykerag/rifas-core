import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useFlashMessages() {
    const { props } = usePage();
    const flash = props.flash as Record<string, string | null>;
    const prevFlashRef = useRef<Record<string, string | null>>({});

    useEffect(() => {
        // Check if flash messages have actually changed to avoid duplicate toasts on re-renders
        // We compare specific keys because the object reference might change even if content is same
        const hasChanged =
            flash.success !== prevFlashRef.current.success ||
            flash.error !== prevFlashRef.current.error ||
            flash.warning !== prevFlashRef.current.warning ||
            flash.info !== prevFlashRef.current.info;

        if (!hasChanged) return;

        // Update ref
        prevFlashRef.current = flash;

        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast.warning(flash.warning);
        }
        if (flash.info) {
            toast.info(flash.info);
        }
    }, [flash]);
}
