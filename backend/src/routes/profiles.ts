import { Hono } from "hono";
import {
  listProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  type ProfileInput,
  type ProfilePatch,
} from "../repositories/profiles";

const profiles = new Hono();

// GET /profiles
profiles.get("/", async (c) => {
  const data = await listProfiles();
  return c.json({ success: true, data });
});

// GET /profiles/:id
profiles.get("/:id", async (c) => {
  const profile = await getProfile(c.req.param("id"));
  if (!profile) return c.json({ success: false, error: "profile not found" }, 404);
  return c.json({ success: true, data: profile });
});

// POST /profiles  { display_name, gender?, style? }
profiles.post("/", async (c) => {
  const body = await c.req.json<Partial<ProfileInput>>();
  if (!body.display_name) {
    return c.json({ success: false, error: "display_name is required" }, 400);
  }
  const profile = await createProfile({
    display_name: body.display_name,
    gender: body.gender ?? null,
    style: body.style ?? null,
  });
  return c.json({ success: true, data: profile }, 201);
});

// PATCH /profiles/:id  { display_name?, gender?, style? }
profiles.patch("/:id", async (c) => {
  const body = await c.req.json<ProfilePatch>();
  const profile = await updateProfile(c.req.param("id"), body);
  if (!profile) return c.json({ success: false, error: "profile not found" }, 404);
  return c.json({ success: true, data: profile });
});

// DELETE /profiles/:id
profiles.delete("/:id", async (c) => {
  const ok = await deleteProfile(c.req.param("id"));
  if (!ok) return c.json({ success: false, error: "profile not found" }, 404);
  return c.json({ success: true });
});

export default profiles;
