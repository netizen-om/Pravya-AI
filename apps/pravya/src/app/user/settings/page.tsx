"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
import LeftArrow from "@/components/icons/LeftArrow";
import axios from "axios";
import {
  bioSchema,
  passwordSchema,
  profileImageSchema,
  usernameSchema,
} from "@/utlis/zod";
import Loader from "@/components/loader/loader";

export default function UserSettingsPage() {
  const [profileImage, setProfileImage] = useState<string>("/profile.png");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [provider, setProvider] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    image: false,
    username: false,
    bio: false,
    password: false,
    data: false,
  });

  useEffect(() => {
    const getUserDetails = async () => {
      setIsLoading((prev) => ({ ...prev, data: true }));
      const res = await axios.get("/api/user/get-user-details");

      if (res.status === 200) {
        const { bio, image, name, provider } = res.data.userResponse;
        setBio(bio ? bio : "");
        setProfileImage(image ? image : "");
        setUsername(name ? name : "");
        setProvider(provider ? provider : "");
      } else {
        toast.error("Error fetching user data");
      }
      setIsLoading((prev) => ({ ...prev, data: false }));
    };
    getUserDetails();
  }, [profileImage]);

  // --- Handlers (unchanged) ---
  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("profileImage") as File;

    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    try {
      profileImageSchema.parse({ file });
      setIsLoading((prev) => ({ ...prev, image: true }));

      const response = await fetch("/api/user/update-profileImage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setProfileImage(result.imageUrl);
        toast.success("Profile image updated successfully!");
      } else {
        toast.error("Failed to update profile image");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating profile image");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, image: false }));
    }
  };

  const handleUsernameUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      usernameSchema.parse({ username });
      setIsLoading((prev) => ({ ...prev, username: true }));

      const response = await fetch("/api/user/update-username", {
        method: "POST",
        body: JSON.stringify({ username }),
      });

      if (response.ok) toast.success("Username updated successfully!");
      else toast.error("Failed to update username");
    } catch (error) {
      if (error instanceof z.ZodError)
        toast.error(error.errors[0].message);
      else toast.error("An error occurred while updating username");
    } finally {
      setIsLoading((prev) => ({ ...prev, username: false }));
    }
  };

  const handleBioUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      bioSchema.parse({ bio });
      setIsLoading((prev) => ({ ...prev, bio: true }));

      const response = await fetch("/api/user/update-bio", {
        method: "PATCH",
        body: JSON.stringify({ newBio: bio }),
      });

      if (response.ok) toast.success("Bio updated successfully!");
      else toast.error("Failed to update bio");
    } catch (error) {
      if (error instanceof z.ZodError)
        toast.error(error.errors[0].message);
      else toast.error("An error occurred while updating bio");
    } finally {
      setIsLoading((prev) => ({ ...prev, bio: false }));
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      passwordSchema.parse({ currentPassword, newPassword, confirmPassword });
      setIsLoading((prev) => ({ ...prev, password: true }));

      const response = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword,
        }),
      });

      const err = await response.json();
      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully!");
      } else toast.error(err?.message || "Failed to update password");
    } catch (error) {
      if (error instanceof z.ZodError)
        toast.error(error.errors[0].message);
      else toast.error("An error occurred while updating password");
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

  if (isLoading.data) return <Loader title="" />;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <LeftArrow />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:pl-16 md:pt-4">
        <div className="max-w-4xl mx-auto py-6 md:p-6">
          {/* Page Header */}
          <div className="mb-6 md:mb-8 hidden md:block">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Manage your account preferences and security
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Profile Image Section */}
            <Card className="bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 transition-colors">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="text-black dark:text-white text-lg md:text-xl">
                  Update Profile Image
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Upload a new profile picture (JPG, PNG, GIF - max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleImageUpload} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Avatar className="h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-neutral-800">
                      <AvatarImage
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="object-cover object-center w-full h-full"
                      />
                      <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white text-lg">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 w-full">
                      <Input
                        type="file"
                        name="profileImage"
                        accept="image/jpeg,image/png,image/gif"
                        className="bg-gray-100 border-gray-300 text-black file:bg-gray-200 file:text-black hover:bg-gray-200
                                   dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:file:bg-neutral-700 dark:file:text-white
                                   focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-xs md:text-sm transition-colors"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.image}
                    className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 
                               dark:bg-white dark:text-black dark:hover:bg-gray-200
                               focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm md:text-base transition-colors"
                  >
                    {isLoading.image ? "Uploading..." : "Update Image"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-200 dark:bg-gray-800" />

            {/* Username Section */}
            <Card className="bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 transition-colors">
              <CardHeader>
                <CardTitle className="text-black dark:text-white text-lg md:text-xl">
                  Update Username
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Change your display name (minimum 3 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUsernameUpdate} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="username"
                      className="text-black dark:text-white text-sm md:text-base"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="mt-2 bg-gray-100 border-gray-300 text-black placeholder:text-gray-500
                                 hover:bg-gray-200 focus:ring-2 focus:ring-black/20
                                 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:ring-white/20
                                 text-sm md:text-base transition-colors"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.username}
                    className="w-full sm:w-auto bg-black text-white hover:bg-gray-800
                               dark:bg-white dark:text-black dark:hover:bg-gray-200
                               focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm md:text-base transition-colors"
                  >
                    {isLoading.username ? "Updating..." : "Update Username"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-200 dark:bg-gray-800" />

            {/* Bio Section */}
            <Card className="bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 transition-colors">
              <CardHeader>
                <CardTitle className="text-black dark:text-white text-lg md:text-xl">
                  Update Bio
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Tell others about yourself (max 500 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBioUpdate} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="bio"
                      className="text-black dark:text-white text-sm md:text-base"
                    >
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write something about yourself..."
                      maxLength={500}
                      className="mt-2 bg-gray-100 border-gray-300 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-black/20
                                 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:focus:ring-white/20
                                 min-h-[80px] md:min-h-[100px] text-sm md:text-base resize-none transition-colors"
                    />
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {bio.length}/500 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.bio}
                    className="w-full sm:w-auto bg-black text-white hover:bg-gray-800
                               dark:bg-white dark:text-black dark:hover:bg-gray-200
                               focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm md:text-base transition-colors"
                  >
                    {isLoading.bio ? "Updating..." : "Update Bio"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-200 dark:bg-gray-800" />

            {/* Password Section */}
            {!provider && (
              <Card className="bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 transition-colors">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white text-lg md:text-xl">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                    Update your account password for security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    {[
                      {
                        id: "currentPassword",
                        label: "Current Password",
                        value: currentPassword,
                        setter: setCurrentPassword,
                      },
                      {
                        id: "newPassword",
                        label: "New Password",
                        value: newPassword,
                        setter: setNewPassword,
                      },
                      {
                        id: "confirmPassword",
                        label: "Confirm New Password",
                        value: confirmPassword,
                        setter: setConfirmPassword,
                      },
                    ].map((field) => (
                      <div key={field.id}>
                        <Label
                          htmlFor={field.id}
                          className="text-black dark:text-white text-sm md:text-base"
                        >
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          type="password"
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          placeholder={field.label}
                          className="mt-2 bg-gray-100 border-gray-300 text-black placeholder:text-gray-500 hover:bg-gray-200 focus:ring-2 focus:ring-black/20
                                     dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:ring-white/20
                                     text-sm md:text-base transition-colors"
                        />
                      </div>
                    ))}

                    <Button
                      type="submit"
                      disabled={isLoading.password}
                      className="w-full sm:w-auto bg-black text-white hover:bg-gray-800
                                 dark:bg-white dark:text-black dark:hover:bg-gray-200
                                 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm md:text-base transition-colors"
                    >
                      {isLoading.password ? "Updating..." : "Reset Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            <div className="pb-6 md:pb-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
