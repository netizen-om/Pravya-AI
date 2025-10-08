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
import { bioSchema, passwordSchema, profileImageSchema, usernameSchema } from "@/utlis/zod";

export default function UserSettingsPage() {
  const [profileImage, setProfileImage] = useState<string>(
    "/profile.png"
  );
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
  });

  useEffect(() => {
    const getUserDetails = async() => {    
      const res = await axios.get("/api/user/get-user-details");
      
      if(res.status === 200) {
        const { bio, image, name, provider } = res.data.userResponse
        console.log(bio);
        setBio(bio ? bio : "");
        setProfileImage(image ? image : "");
        setUsername(name ? name : "");
        setProvider(provider ? provider : "");
      } else {
        toast.error("Error fetching user data");
      }
    }
    getUserDetails();
  }, [profileImage])

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

      if (response.ok) {
        toast.success("Username updated successfully!");
      } else {
        toast.error("Failed to update username");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating username");
      }
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
        body: JSON.stringify({ newBio : bio }),
      });

      if (response.ok) {
        toast.success("Bio updated successfully!");
      } else {
        toast.error("Failed to update bio");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating bio");
      }
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
        body: JSON.stringify({ oldPassword : currentPassword, newPassword : newPassword }),
      });
      const err = await response.json();
      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully!");
      } else {
        if(err) {
          toast.error(err.message);
        } else {
          toast.error("Failed to update password");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating password");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navigation Header */}
      <div className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-sm border-b ">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <LeftArrow />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Desktop Back Button */}
      

      {/* Main Content */}
      <div className="px-4 md:pl-16 md:pt-4">
        <div className="max-w-4xl mx-auto py-6 md:p-6">
          {/* Page Header - Hidden on mobile since it's in the nav */}
          <div className="mb-6 md:mb-8 hidden md:block">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Manage your account preferences and security
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Profile Image Section */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="text-white text-lg md:text-xl">
                  Update Profile Image
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Upload a new profile picture (JPG, PNG, GIF - max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleImageUpload} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Avatar className="h-16 w-16 md:h-20 md:w-20 shrink-0">
                      <AvatarImage
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-gray-700 text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 w-full">
                      <Input
                        type="file"
                        name="profileImage"
                        accept="image/jpeg,image/png,image/gif"
                        className="bg-neutral-800 border-neutral-700 text-white file:bg-neutral-700 file:text-white file:border-0 file:rounded-md file:px-2 md:file:px-4 file:py-1 file:text-xs md:file:text-sm file:mr-2 md:file:mr-4 hover:bg-neutral-700 focus:ring-2 focus:ring-white/20 text-xs md:text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.image}
                    className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                  >
                    {isLoading.image ? "Uploading..." : "Update Image"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-800" />

            {/* Username Section */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="text-white text-lg md:text-xl">Update Username</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Change your display name (minimum 3 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUsernameUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-white text-sm md:text-base">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="mt-2 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 hover:bg-neutral-700 focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.username}
                    className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                  >
                    {isLoading.username ? "Updating..." : "Update Username"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-800" />

            {/* Bio Section */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="text-white text-lg md:text-xl">Update Bio</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Tell others about yourself (max 500 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBioUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="bio" className="text-white text-sm md:text-base">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write something about yourself..."
                      maxLength={500}
                      className="mt-2 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-white/20 min-h-[80px] md:min-h-[100px] text-sm md:text-base resize-none"
                    />
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {bio.length}/500 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.bio}
                    className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                  >
                    {isLoading.bio ? "Updating..." : "Update Bio"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-800" />

            {/* Password Section */}
            { !provider && (
              <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="text-white text-lg md:text-xl">Reset Password</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Update your account password for security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-white text-sm md:text-base">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="mt-2 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-white text-sm md:text-base">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="mt-2 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 hover:bg-neutral-700 focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-white text-sm md:text-base">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="mt-2 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.password}
                    className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                  >
                    {isLoading.password ? "Updating..." : "Reset Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            )}

            {/* Bottom spacing for mobile */}
            <div className="pb-6 md:pb-0" />
          </div>
        </div>
      </div>
    </div>
  );
}