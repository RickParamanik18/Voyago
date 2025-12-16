"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const router = useRouter();

interface formDataType {
    login_email?: string;
    login_password?: string;
    signup_name?: string;
    signup_email?: string;
    signup_password?: string;
}

export default function Auth() {
    const [formData, setFormData] = useState<formDataType>({});

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogin = async () => {
        try {
            if (!formData.login_email || !formData.login_password) {
                alert("Email and password are required");
                return;
            }

            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.login_email,
                    password: formData.login_password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            console.log("Login success:", data);
            router.push("/");
        } catch (error: any) {
            console.error("Login error:", error.message);
        }
    };

    const handleSignup = async () => {
        try {
            if (
                !formData.signup_name ||
                !formData.signup_email ||
                !formData.signup_password
            ) {
                alert("All fields are required");
                return;
            }

            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.signup_name,
                    email: formData.signup_email,
                    password: formData.signup_password,
                }),
            });

            const data = await res.json();
            router.push("/");
            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            console.log("Signup success:", data);
            router.push("/");
        } catch (error: any) {
            console.error("Signup error:", error.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs defaultValue="login">
                    <TabsList>
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl text-center">
                                    Log-in
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="user_email">Email</Label>
                                    <Input
                                        id="user_email"
                                        name="login_email"
                                        placeholder="Enter your email"
                                        type="email"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="user_password">
                                        Password
                                    </Label>
                                    <Input
                                        id="user_password"
                                        name="login_password"
                                        placeholder="Enter your password"
                                        type="password"
                                        onChange={handleChange}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleLogin}>Login</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl text-center">
                                    Sign-up
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="user_name">Name</Label>
                                    <Input
                                        id="user_name"
                                        name="signup_name"
                                        placeholder="Enter your name"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="user_email_signup">
                                        Email
                                    </Label>
                                    <Input
                                        id="user_email_signup"
                                        name="signup_email"
                                        placeholder="Enter your email"
                                        type="email"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="user_password_signup">
                                        Password
                                    </Label>
                                    <Input
                                        id="user_password_signup"
                                        name="signup_password"
                                        placeholder="Enter your password"
                                        type="password"
                                        onChange={handleChange}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSignup}>Signup</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
