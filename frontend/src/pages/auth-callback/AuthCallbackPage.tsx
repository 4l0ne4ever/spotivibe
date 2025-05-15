import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempted.current) return;
      try {
        console.log("Sending user data:", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
        syncAttempted.current = true;
        const response = await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });

        console.log("Server response:", response.data);
        navigate("/");
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setError(error?.response?.data?.message || "Failed to authenticate");
        // Still navigate after a delay even if there's an error
        setTimeout(() => navigate("/"), 3000);
      }
    };

    syncUser();
  }, [isLoaded, user, navigate]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          {error ? (
            <>
              <h3 className="text-red-400 text-xl font-bold">
                Authentication Error
              </h3>
              <p className="text-zinc-400 text-sm">{error}</p>
            </>
          ) : (
            <>
              <Loader className="size-6 text-emerald-500 animate-spin" />
              <h3 className="text-zinc-400 text-xl font-bold">
                Logging you in
              </h3>
              <p className="text-zinc-400 text-sm">Redirecting...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallbackPage;
