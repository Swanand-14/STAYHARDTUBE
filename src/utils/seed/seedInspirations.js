import { User } from "../../models/user.model";
import mongoose from "mongoose";
import { asyncHandler } from "../asyncHandler";

const inspirations = [
  {
    fullname: "David Goggins",
    username: "goggins",
    email: "goggins@stayhard.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/7/72/David_Goggins_2019.jpg",
    role: "inspiration",
    tags: ["stayhard", "mental-toughness", "no-excuses", "discipline"],
    password: "StayHard123"
  },
  {
    fullname: "Jocko Willink",
    username: "jocko",
    email: "jocko@disciplineequals.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Jocko_Willink_2018.jpg",
    role: "inspiration",
    tags: ["discipline", "leadership", "extreme-ownership", "grind"],
    password: "Discipline123"
  },
  {
    fullname: "Andrew Huberman",
    username: "huberman",
    email: "huberman@neuro.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/6/68/Andrew_Huberman_2022.jpg",
    role: "inspiration",
    tags: ["neuroscience", "focus", "sleep", "optimization"],
    password: "BrainPower123"
  },
  {
    fullname: "James Clear",
    username: "jamesclear",
    email: "james@atomic.com",
    avatar: "https://images-na.ssl-images-amazon.com/images/I/81E9w1SCUmL.jpg",
    role: "inspiration",
    tags: ["habits", "consistency", "atomic-habits", "self-improvement"],
    password: "HabitsWin123"
  },
  {
    fullname: "Jordan Peterson",
    username: "peterson",
    email: "jordan@truth.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/6/69/Jordan_B_Peterson_2017.jpg",
    role: "inspiration",
    tags: ["psychology", "responsibility", "truth", "masculinity"],
    password: "TruthRules123"
  },
  {
    fullname: "Mark Manson",
    username: "markmanson",
    email: "mark@subtleart.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/3/32/Mark_Manson_2019.jpg",
    role: "inspiration",
    tags: ["no-bs", "selfhelp", "emotions", "mindset"],
    password: "NoFluff123"
  },
  {
    fullname: "Gary Vaynerchuk",
    username: "garyvee",
    email: "gary@hustle.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/8/87/Gary_Vaynerchuk_2016.jpg",
    role: "inspiration",
    tags: ["hustle", "marketing", "entrepreneurship", "execution"],
    password: "HustleHard123"
  },
  {
    fullname: "Chris Bumstead",
    username: "cbum",
    email: "cbum@fitness.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Chris_Bumstead_2021.jpg",
    role: "inspiration",
    tags: ["bodybuilding", "discipline", "fitness", "aesthetics"],
    password: "CBumClassic123"
  },
  {
    fullname: "David Sinclair",
    username: "sinclair",
    email: "david@longevity.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3f/David_Sinclair_2019.jpg",
    role: "inspiration",
    tags: ["longevity", "anti-aging", "health", "science"],
    password: "LiveLong123"
  },
  {
    fullname: "Cal Newport",
    username: "calnewport",
    email: "cal@deepwork.com",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Cal_Newport.jpg",
    role: "inspiration",
    tags: ["deepwork", "focus", "productivity", "tech-minimalism"],
    password: "DeepFocus123"
  }
];









