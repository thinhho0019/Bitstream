import { Account } from "@/types/account";
import { useEffect, useState } from "react";

export const useProfile = () => {
    const [loading, setLoading] = useState<boolean>();
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<Account | null>();
    const getUsetForToken = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth");
            if (!res.ok) {
                //fail request get token for api
                setError("fail get user");
                setUser(null);
                return;
            }
            const data = await res.json();
            console.log("data", data);
            const dataUser: Account = {
                email: data.email,
                image: data.image,
                name: data.name
            };
            setUser(dataUser);
        } catch (error) {
            console.error("Error fetching user for token:", error);
            setUser(null);
            setError("Failed to fetch user for token");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getUsetForToken();
    }, [])
    return { loading, error, user, refetch: getUsetForToken };
}