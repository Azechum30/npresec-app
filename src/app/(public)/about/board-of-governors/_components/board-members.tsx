/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Building2,
  Crown,
  type LucideIcon,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type BoardMembersProps = {
  id: string;
  name: string;
  role: string;
  affiliation: string | null;
  bio: string | null;
  picture: string | null;
  is_active: boolean;
};

const roleIcons: Record<string, LucideIcon> = {
  ChairPerson: Crown,
  ViceChairPerson: Star,
  Secretary: User,
  Treasurer: Building2,
  Member: Users,
};

const roleGradients = {
  ChairPerson: "from-primary to-secondary",
  ViceChairPerson: "from-primary to-accent",
  Secretary: "from-secondary to-primary",
  Treasurer: "from-accent to-primary",
  Member: "from-primary to-secondary",
};

export const BoardMembers = ({
  id,
  name,
  role,
  affiliation,
  bio,
  picture,
  is_active,
}: BoardMembersProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const pictureUrl = picture
    ? picture.startsWith("http") ||
      picture.startsWith("https") ||
      picture.startsWith("/")
      ? picture
      : "/no-avatar.jpg"
    : "/no-avatar.jpg";

  const displayRole =
    role === "ChairPerson"
      ? "Chairperson"
      : role === "ViceChairPerson"
        ? "Vice Chairperson"
        : role;

  const RoleIcon = roleIcons[role as keyof typeof roleIcons] || Users;
  const gradient =
    roleGradients[role as keyof typeof roleGradients] ||
    "from-primary to-secondary";

  return (
    <Card
      className="group relative overflow-hidden bg-background/60 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Gradient background overlay */}
      <div
        className={`
          absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500
          ${gradient}
          ${isHovered ? "opacity-5" : "opacity-0"}
        `}
      />

      {/* Status indicator */}
      {is_active && (
        <div className="absolute top-4 right-4 z-10">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
            <div className="w-2 h-2 bg-primary rounded-full mr-1 animate-pulse" />
            Active
          </Badge>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-linear-to-br from-primary/10 to-secondary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-linear-to-br from-accent/20 to-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Sparkle decoration */}
      <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <CardContent className="relative p-6">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className={`
                w-24 h-24 rounded-full p-1 transition-all duration-300
                ${
                  isHovered
                    ? `bg-linear-to-br ${gradient} shadow-lg scale-110`
                    : "bg-linear-to-br from-muted to-muted/60"
                }
              `}>
              <div className="w-full h-full rounded-full overflow-hidden bg-background">
                <Image
                  src={imageError ? "/no-avatar.jpg" : pictureUrl}
                  alt={name}
                  width={88}
                  height={88}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
              </div>
            </div>

            {/* Role icon badge */}
            <div
              className={`
                absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                ${
                  isHovered
                    ? `bg-linear-to-br ${gradient} text-white scale-110`
                    : "bg-background border-2 border-border text-foreground/70"
                }
              `}>
              <RoleIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
            {name}
          </h3>
          <div className="h-px w-16 bg-linear-to-r from-transparent via-border to-transparent mx-auto" />
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 group-hover:bg-accent/50 transition-colors duration-300">
            <span className="text-sm font-medium text-foreground/70">Role</span>
            <div className="flex items-center gap-2">
              <RoleIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {displayRole}
              </span>
            </div>
          </div>

          {affiliation && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 group-hover:bg-accent/50 transition-colors duration-300">
              <span className="text-sm font-medium text-foreground/70">
                Affiliation
              </span>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span
                  className="text-sm text-foreground text-right max-w-30 truncate"
                  title={affiliation}>
                  {affiliation}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bio preview */}
        {bio && (
          <div className="mb-6">
            <p className="text-xs text-foreground/70 leading-relaxed line-clamp-2">
              {bio.length > 80 ? `${bio.substring(0, 80)}...` : bio}
            </p>
          </div>
        )}

        <Separator className="mb-4 bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Action Button */}
        <Link href={`/about/board-of-governors/${id}`} className="block w-full">
          <Button
            variant="ghost"
            className="w-full group/btn relative overflow-hidden bg-transparent hover:bg-primary/5 border border-border hover:border-primary/30 transition-all duration-300">
            {/* Button gradient overlay */}
            <div
              className={`
                absolute inset-0 bg-linear-to-r opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300
                ${gradient}
              `}
            />

            <div className="relative flex items-center justify-center gap-2">
              <span className="text-sm font-medium group-hover/btn:text-primary transition-colors duration-300">
                Read More
              </span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:text-primary transition-all duration-300" />
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
