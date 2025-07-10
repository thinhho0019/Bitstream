import { Account } from "@/types/account";
import { useEffect, useState } from "react";

export const useProfile = () => {
    const [loading, setLoading] = useState<boolean>();
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<Account>();
    const getUsetForToken = async () => {
        setLoading(true);
        const res = await fetch("/api/auth");
        if (!res.ok) {
            //fail request get token for api
            setError("fail get user");
            return;
        }
        const data = await res.json();
        const dataUser: Account = {
            email: data.email,
            image: data.image,
            name: data.name
        };
        setUser(dataUser);
        setLoading(false);
    }
    useEffect(() => {
        getUsetForToken();
    }, [])
    return { loading, error, user, refetch: getUsetForToken };
}