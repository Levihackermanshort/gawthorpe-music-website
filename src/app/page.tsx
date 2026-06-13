"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Music,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Send,
  Package,
  Headphones,
  Settings,
  Radio,
  FileText,
  CheckCircle,
  Calendar,
  X,
  Phone,
  Mail,
  MapPin,
  Disc,
  ArrowRight,
  Info,
  DollarSign,
  ChevronDown,
  Layers,
  AlertCircle
} from "lucide-react";

// Firebase integrations
import Image from "next/image";
import AiChat from "@/components/AiChat";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

// Mock Data
const CATALOG_TRACKS = [
  {
    id: 1,
    title: "Slip, Slide",
    artist: "GTMCE Syndicate",
    duration: "3:16",
    genre: "UK Drill",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/slip-slide",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    bpm: 142,
    releaseDate: "2026-05-15",
    image: "https://i1.sndcdn.com/artworks-N3HQAyyawuHkuSsl-BVHC0A-t500x500.jpg"
  },
  {
    id: 2,
    title: "Covid Alarm Intro",
    artist: "Dj_Amba",
    duration: "0:25",
    genre: "Intro / Grime",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/intro",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    bpm: 130,
    releaseDate: "2026-01-20",
    image: "https://i1.sndcdn.com/artworks-2inCxZWgEYZhBoE0-iiZJTw-t500x500.jpg"
  },
  {
    id: 3,
    title: "Took A Lot",
    artist: "Dark Horse Ft. STAV, Tee1nna",
    duration: "3:36",
    genre: "Wave Trap",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/dark-horse-x-stav-x-t1nna-took-a-lot",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    bpm: 135,
    releaseDate: "2026-02-10",
    image: "https://i1.sndcdn.com/artworks-Ix19yRyujlq2HIVx-SyXUyQ-t500x500.jpg"
  },
  {
    id: 4,
    title: "What do you Mean?",
    artist: "Dark Horse Ft. LEW",
    duration: "2:37",
    genre: "Melodic Trap",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/dark-horse-ft-lew-what-do-you-mean",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    bpm: 128,
    releaseDate: "2026-03-01",
    image: "https://i1.sndcdn.com/artworks-AAyLlYnWH8oyStJ9-qYYhJw-t500x500.jpg"
  },
  {
    id: 5,
    title: "Work Comes First",
    artist: "A-C x Dark Horse",
    duration: "3:15",
    genre: "UK Drill",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/a-c-x-dark-horse-work-comes-first",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    bpm: 140,
    releaseDate: "2026-03-24",
    image: "https://i1.sndcdn.com/artworks-zBVyWkSkU6v1zRte-7ftkkA-t500x500.jpg"
  },
  {
    id: 6,
    title: "After Lockdown Mix",
    artist: "Dj_Amba",
    duration: "3:17",
    genre: "Garage / House",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/dj_amba-after-lockdown-mix-grimehousegarage",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    bpm: 134,
    releaseDate: "2026-04-05",
    image: "https://i1.sndcdn.com/artworks-rGkOUh3LVyyNAryc-0j64tw-t500x500.jpg"
  },
  {
    id: 7,
    title: "Sshh",
    artist: "OLI T",
    duration: "3:26",
    genre: "UK Drill",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/oli-lloyd-sh",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    bpm: 141,
    releaseDate: "2026-04-18",
    image: "https://i1.sndcdn.com/artworks-xNXz27wLZeBRFJE4-EfWtrQ-t500x500.jpg"
  },
  {
    id: 8,
    title: "Everywhere Everywhere",
    artist: "Dark Horse X M.A.T",
    duration: "3:49",
    genre: "Melodic Drill",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/jonny-djamba-x-mat-everywhere-everywhere",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    bpm: 138,
    releaseDate: "2026-05-02",
    image: "https://i1.sndcdn.com/artworks-000656877364-jkbuxf-t500x500.jpg"
  },
  {
    id: 9,
    title: "SUNSET",
    artist: "Dark Horse X M.A.T",
    duration: "3:52",
    genre: "Cloud Rap",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/jonny-djamba-x-mat-sunset",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    bpm: 125,
    releaseDate: "2026-05-12",
    image: "https://i1.sndcdn.com/artworks-000623429152-qp3jaj-t500x500.jpg"
  },
  {
    id: 10,
    title: "Everyday",
    artist: "Dark Horse",
    duration: "4:25",
    genre: "Hip Hop",
    soundcloudUrl: "https://soundcloud.com/gawthorpetingmusic/jonny-djamba-everyday",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    bpm: 120,
    releaseDate: "2026-05-28",
    image: "https://i1.sndcdn.com/artworks-RFifoWOQg3zHoMyW-9AwhWg-t500x500.jpg"
  }
];

const SHOP_ITEMS = [
  {
    id: "prod_sig_tshirt",
    name: "G.T.M.C.E Signature T-shirt",
    price: 25.00,
    category: "Apparel",
    image: "👕",
    imageUrl: "/T-shirt_view1.png",
    description: "Our signature heavyweight cotton t-shirt featuring the iconic Gawthorpe Ting Music logo. Designed for comfort and style, whether you're in the studio or on the streets.",
    stock: 24
  },
  {
    id: "prod_1",
    name: "GTMCE 'Gawthorpe Ting' Heavyweight Hoodie",
    price: 49.99,
    category: "Apparel",
    image: "👕",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    description: "Premium 450GSM ultra-soft loopback cotton hoodie with high-density red screen print logo. Limited run.",
    stock: 12
  },
  {
    id: "prod_2",
    name: "GTMCE Mixtape Vol. 1 [Limited Red Color Vinyl]",
    price: 24.99,
    category: "Music",
    image: "💿",
    imageUrl: "https://images.unsplash.com/photo-1539625313006-2335750d903b?auto=format&fit=crop&w=600&q=80",
    description: "EXCLUSIVE press of our debut compilation record. Stunning translucent red vinyl with gatefold jacket.",
    stock: 5
  },
  {
    id: "prod_3",
    name: "GTMCE 'Underground To Wave' Graphic Tee",
    price: 29.99,
    category: "Apparel",
    image: "👕",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    description: "100% organic heavy ringspun cotton t-shirt with stylized graphics profiling our studio origins.",
    stock: 18
  },
  {
    id: "prod_4",
    name: "GTMCE VIP Showcase Ticket - London & Leeds Tour",
    price: 15.00,
    category: "Tickets",
    image: "🎟️",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    description: "Admit-one VIP guest entry ticket with soundcheck access and standard complimentary drink voucher.",
    stock: 45
  }
];

const SERVICES = [
  {
    id: "srv_record",
    title: "A-Grade Audio Recording",
    tagline: "Absolute Isolation & Premium Hardware",
    price: "From £40/hr",
    description: "State-of-the-art live tracking utilizing high-fidelity vacuum tube microphones, analogue solid-state preamps, and treatment panels optimized for perfect acoustics.",
    features: [
      "Access to premium tube microphones",
      "Dedicated senior sound engineer included",
      "Full digital raw stems copy provided immediately",
      "Vocal correction, tuning and standard layout edit"
    ]
  },
  {
    id: "srv_master",
    title: "Premium Mixing & Mastering",
    tagline: "Mainstream Loudness & Acoustic Dynamics",
    price: "From £120/track",
    description: "Industry-standard processing tailored for streaming platforms (Spotify, Apple Music, SoundCloud) optimizing dynamic ranges with analogue tube limiters and modern digital visualizers.",
    features: [
      "Multi-band analogue compression master",
      "Stereo fields widening and spatial balancing",
      "Targeted LUFS levels optimized for streaming",
      "Up to 3 revisions to ensure perfect client control"
    ]
  },
  {
    id: "srv_nanny",
    title: "GTMCE 'Nanny' Partnership Package",
    tagline: "Social approach instead of corporate control",
    price: "Custom Monthly Plan",
    description: "Rather than solely competing, GTMCE acts as a 'nanny' (think Mary Poppins or Nanny McPhee) for upcoming talents and organizations. Total support with clients maintaining 100% creative control.",
    features: [
      "Strategic distribution schedule and release calendar",
      "Sourcing beats, production engineering & features",
      "Brand identity design and digital marketing support",
      "Zero-percentage commission distribution structures"
    ]
  }
];

const INVESTMENT_PLANS = [
  {
    name: "The Talent Incubator Starter",
    tagline: "Empowering Next-Gen Underground Creators",
    price: "£1,499",
    type: "One-off",
    description: "A tailored micro-investment program that handles single-track production, visual branding, and release campaigns. Designed for early-stage commercial proof.",
    benefits: [
      "2 Single-track fully mixed masters",
      "Professional standard promotional press release kits",
      "SoundCloud / Spotify premium sponsored distribution campaign",
      "Targeted digital billboard projection on local avenues"
    ]
  },
  {
    name: "Mainstream Shift Package",
    tagline: "Digital scaling, recurring revenue, and arts funding support",
    price: "£4,999",
    type: "Enterprise / Joint",
    isPopular: true,
    description: "A complete launchpad crafted to transform talent from basement underground to viral mainstream status with full financial transparency.",
    benefits: [
      "Full 5-track EP production, mixing, and licensing",
      "Professional cinematic music video (4K UHD) with storyboard",
      "Targeted influencer campaign and TikTok audio distribution",
      "GTMCE operational desk assistance for grant proposals (Arts Council / Banks)"
    ]
  }
];

const FAQS = [
  {
    question: "What does 'It's a Gawthorpe Ting' mean?",
    answer: "It is our proud cultural claim representing our roots in Gawthorpe. It's about maintaining underground authenticity, supporting local talents, and bringing raw community energy into the professional mainstream music workspace."
  },
  {
    question: "Do artists retain their distribution rights?",
    answer: "Yes, 100%. GTMCE operates on a 'social partnership model' (our Mary Poppins philosophy). We focus on supporting your development, providing first-rate equipment, and guiding marketing rather than locking you into predatory long-term royalties."
  },
  {
    question: "How does the 'Nanny' partnership program work?",
    answer: "We step in as supportive guardians to support upcoming musicians, small brands, and organisations. We provide the equipment, strategy, studio time, and marketing muscle while you stay in full control. When you're ready to fly solo, we hand over everything with zero strings attached."
  },
  {
    question: "Can I submit my music demo for review?",
    answer: "Absolutely. Use our inquiry form below to upload your SoundCloud or streaming link. Our production team reviews all submissions every Friday and contacts promising talent for free initial studio sessions."
  }
];

interface ShowcaseImageCardProps {
  src: string;
  idx: number;
  title?: string;
  desc?: string;
}

function ShowcaseImageCard({ src, idx, title, desc }: ShowcaseImageCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: (idx % 6) * 0.05 }}
      whileHover={{ y: -4 }}
      className="break-inside-avoid relative group rounded-xl overflow-hidden border border-white/5 bg-neutral-900/50 min-h-[150px] transition-all duration-500 hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)] cursor-pointer"
    >
      {!loaded && !error && (
        <div className="absolute inset-0 bg-neutral-950 animate-pulse flex flex-col items-center justify-center p-4">
          <div className="w-5 h-5 rounded-full border border-red-500/20 border-t-red-500 animate-spin mb-2" />
          <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">LOADING...</span>
        </div>
      )}
      
      {!error ? (
        <img 
          src={src} 
          alt={title || `GTMCE Studio Showcase ${idx + 1}`} 
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-auto object-cover transition-all duration-700 ease-out ${
            loaded 
              ? "opacity-75 saturate-[0.7] contrast-[0.95] group-hover:opacity-100 group-hover:scale-[1.06] group-hover:saturate-[1.1] group-hover:contrast-[1.05]" 
              : "opacity-0"
          }`} 
        />
      ) : (
        <div className="w-full aspect-[4/3] min-h-[180px] bg-neutral-950 border border-white/5 flex flex-col items-center justify-center p-6 relative overflow-hidden group-hover:border-red-500/20 transition-all duration-500 bg-gradient-to-br from-neutral-950 via-neutral-900/40 to-neutral-950">
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black pointer-events-none" />
          {/* Futuristic subtle scanning elements */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="w-10 h-10 rounded-full border border-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-red-500/40 group-hover:bg-red-950/20 transition-all duration-500 bg-red-950/10">
            <span className="text-red-500 text-xs font-mono font-black animate-pulse">#</span>
          </div>
          <span className="text-[9px] font-mono text-red-500/60 uppercase tracking-[0.2em] mb-2 font-bold select-none">
            MILESTONE PERSISTED
          </span>
          <span className="text-sm font-black text-white/90 uppercase text-center tracking-wider max-w-[220px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {title ? title.replace(/^\d+\.\s+/, "") : `ARCHIVE_NO.${idx + 1}`}
          </span>
          {desc && (
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-2 text-center max-w-[240px]">
              {desc}
            </span>
          )}
        </div>
      )}

      {/* Dynamic Red Gradient Tint overlay on hover with mix-blend-color-burn */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-red-950/20 to-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out pointer-events-none mix-blend-color-burn" />
      
      {/* Shimmer / light sweep effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Modern Vignette Gradient overlay (Always on, but deepens on hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Corner borders for detailed high-tech/premium craftsmanship */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/0 group-hover:border-red-500/40 transition-colors duration-500 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-red-500/0 group-hover:border-red-500/40 transition-colors duration-500 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-red-500/0 group-hover:border-red-500/40 transition-colors duration-500 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-red-500/0 group-hover:border-red-500/40 transition-colors duration-500 pointer-events-none" />

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0 pointer-events-none flex items-center justify-between z-15">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-mono text-red-500 font-bold tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.3)] truncate">
            {title || `ARCHIVE_NO.${String(idx + 1).padStart(3, '0')}`}
          </span>
          {desc && (
            <span className="text-[9px] text-white/50 uppercase font-bold tracking-wider mt-0.5 truncate mt-1">
              {desc}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider shrink-0 ml-2">
          {title ? "COMPLETED //" : "VIEW ARCHIVE //"}
        </span>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(35); // simulated percent
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [activeYearTab, setActiveYearTab] = useState("1");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryService, setInquiryService] = useState("record");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryLink, setInquiryLink] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // States for user authorization, loading and checkout success confirmation
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeOrderNotification, setActiveOrderNotification] = useState<any>(null);

  // Stats & Admin states
  const [siteVisits, setSiteVisits] = useState(1284);
  const [activeSessions, setActiveSessions] = useState(7);
  const [soundCloudPlays, setSoundCloudPlays] = useState(3145290);
  const [adminView, setAdminView] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Merchandise T-shirt show off states
  const [activeTshirtView, setActiveTshirtView] = useState("/T-shirt_view1.png");
  const [selectedTshirtSize, setSelectedTshirtSize] = useState("M");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [portfolioTab, setPortfolioTab] = useState<"archive" | "progress">("progress");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync auth state
  useEffect(() => {
    if (!mounted) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        // Log profile into users collection on firestore
        const userRef = doc(db, "users", currentUser.uid);
        setDoc(userRef, {
          uid: currentUser.uid,
          name: currentUser.displayName || "Anonymous Artist",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
          createdAt: serverTimestamp()
        }, { merge: true }).catch(err => {
          console.error("User registration cataloging error:", err);
        });
      }
    });
    return () => unsubscribe();
  }, [mounted]);

  // Auth stream listeners for Inquiries & Orders in real time
  useEffect(() => {
    if (!user) {
      setSubmissions([]);
      setOrders([]);
      return;
    }

    // Unsubscribe helper placeholders
    let unsubscribeInquiries = () => {};
    let unsubscribeOrders = () => {};

    try {
      // Set up live stream listener for inquiries
      const inquiriesQuery = query(
        collection(db, "inquiries"),
        where("userId", "==", user.uid)
      );

      unsubscribeInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          list.push({
            id: doc.id,
            ...d,
            timestamp: d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleTimeString() : new Date().toLocaleTimeString()
          });
        });
        setSubmissions(list);
      }, (err) => {
        console.warn("Firestore inquiry subscription error:", err);
      });

      // Set up live stream listener for orders
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          list.push({
            id: doc.id,
            ...d,
            timestamp: d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleTimeString() : new Date().toLocaleTimeString()
          });
        });
        setOrders(list);
      }, (err) => {
        console.warn("Firestore order subscription error:", err);
      });
    } catch (e) {
      console.error("Firestore streams setup blocker", e);
    }

    return () => {
      unsubscribeInquiries();
      unsubscribeOrders();
    };
  }, [user]);

  // Listen for Stripe redirect success triggers (session_id) on portal mount
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      const sandbox = urlParams.get("sandbox");
      
      if (sessionId) {
        const itemType = urlParams.get("item_type");
        
        if (itemType === "package") {
          const itemName = urlParams.get("item_name");
          const itemPrice = urlParams.get("item_price");
          const newOrder = {
            id: "order_" + sessionId.substring(15, 23),
            items: [{ name: itemName + " (Strategic Investor Plan)", price: Number(itemPrice), quantity: 1 }],
            total: Number(itemPrice).toFixed(2),
            timestamp: new Date().toLocaleTimeString(),
            status: sandbox === "true" ? "Sandbox Approved" : "Processing Distribution"
          };
          
          if (auth.currentUser) {
            const orderRef = doc(db, "orders", newOrder.id);
            setDoc(orderRef, {
              ...newOrder,
              userId: auth.currentUser.uid,
              createdAt: serverTimestamp()
            }).catch(e => console.error("Firestore investor order log fail:", e));
          }
          setActiveOrderNotification(newOrder);
        } else {
          // Check standard basket caching
          const savedCart = localStorage.getItem("gtmce_pending_cart");
          if (savedCart) {
            try {
              const parsedItems = JSON.parse(savedCart);
              const sumTotal = parsedItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0).toFixed(2);
              const newOrder = {
                id: "order_shop_" + sessionId.substring(14, 22),
                items: parsedItems,
                total: sumTotal,
                timestamp: new Date().toLocaleTimeString(),
                status: sandbox === "true" ? "Sandbox Despatched" : "Approved & Despatched"
              };
              
              if (auth.currentUser) {
                const orderRef = doc(db, "orders", newOrder.id);
                setDoc(orderRef, {
                  ...newOrder,
                  userId: auth.currentUser.uid,
                  createdAt: serverTimestamp()
                }).catch(e => console.error("Firestore shop catalog order fail:", e));
              }
              setActiveOrderNotification(newOrder);
              localStorage.removeItem("gtmce_pending_cart");
              setCart([]);
            } catch (e) {
              console.error("Cache processing failed:", e);
            }
          }
        }
        
        // Remove tracking keys from bar without full refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [mounted]);

  // Auth Operations
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google Auth SignIn Popup exception:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError(
          "The Google Sign-In window was closed before completing authentication. If you are browsing the app in a preview panel, please try opening GTMCE in a new tab by clicking the arrow icon at the top corner of your preview panel for a smooth, unrestricted login process!"
        );
      } else if (err.code === "auth/blocked-by-popup-resolver" || err.message?.includes("popup") || err.message?.includes("closed")) {
        setAuthError(
          "Google Sign-In popup blocked or terminated. Please allow popups or try opening the app in a new tab to bypass iframe restrictions."
        );
      } else {
        setAuthError(err.message || "An unexpected error occurred during Google Sign-In. Please try again.");
      }
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Google Auth Logout exception:", err);
    }
  };

  // Audio player setup
  const currentTrack = CATALOG_TRACKS[currentTrackIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new window.Audio();
      
      const handleTimeUpdate = () => {
        if (audioRef.current) {
          const cur = audioRef.current.currentTime || 0;
          const dur = audioRef.current.duration || 165;
          setCurrentTime(cur);
          if (!isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
            setTrackDuration(audioRef.current.duration);
            setTrackProgress(Math.floor((cur / audioRef.current.duration) * 100));
          }
        }
      };

      const handleLoadedMetadata = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          setTrackDuration(audioRef.current.duration);
        }
      };

      const handleEnded = () => {
        handleNextTrack();
      };

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleEnded);

      // Sourcing index 0
      audioRef.current.src = currentTrack.audioSrc;
      audioRef.current.load();

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
          audioRef.current.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, []);

  // Update track when index shifts
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioSrc;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      } else {
        setTrackProgress(0);
        setCurrentTime(0);
      }
    }
  }, [currentTrackIndex]);

  // Handle play/pause commands
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Playback blocked by browser autoplay constraints:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setSoundCloudPlays((p) => p + 1);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % CATALOG_TRACKS.length);
    setTrackProgress(0);
    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + CATALOG_TRACKS.length) % CATALOG_TRACKS.length);
    setTrackProgress(0);
    setCurrentTime(0);
  };

  // Cart Functions
  const addToCart = (item: typeof SHOP_ITEMS[0]) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        return prevCart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((c) => c.id !== id));
  };

  const totalCartAmount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0).toFixed(2);
  }, [cart]);

  // Submit Inquiry
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;

    if (!user) {
      alert("Please login with Google first to submit demos and book studio recording terms.");
      handleGoogleSignIn();
      return;
    }

    setInquiryLoading(true);

    const newInquiry = {
      id: "inq_" + Date.now(),
      userId: user.uid,
      name: inquiryName,
      email: inquiryEmail,
      service: inquiryService,
      link: inquiryLink || "N/A",
      message: inquiryMessage,
      status: "New Demo"
    };

    try {
      await setDoc(doc(db, "inquiries", newInquiry.id), {
        ...newInquiry,
        createdAt: serverTimestamp()
      });

      setInquirySuccess(true);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryMessage("");
      setInquiryLink("");
    } catch (error) {
      console.error("Failed to write inquiry to Firestore:", error);
      // Fallback local persistence if offline
      setSubmissions((prev) => [newInquiry, ...prev]);
      setInquirySuccess(true);
    } finally {
      setInquiryLoading(false);
    }
  };

  // Submit Order via server side stripe checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!user) {
      alert("Please login with Google first to complete GTMCE basket checkout securely.");
      handleGoogleSignIn();
      return;
    }

    setCheckoutLoading(true);
    localStorage.setItem("gtmce_pending_cart", JSON.stringify(cart));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          isPackage: false,
          successUrl: window.location.origin + window.location.pathname,
          cancelUrl: window.location.origin + window.location.pathname,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Stripe session setup failed.");
        setCheckoutLoading(false);
      }
    } catch (err) {
      console.error("Checkout dispatch error:", err);
      alert("Network exception contacting payment handler.");
      setCheckoutLoading(false);
    }
  };

  // Submit Strategic / Investor Package checkout
  const handlePackageBuy = async (plan: any) => {
    if (!user) {
      alert("Please login with Google first to acquire development licenses and invest securely.");
      handleGoogleSignIn();
      return;
    }

    setCheckoutLoading(true);
    const priceNumeric = Number(plan.price.replace(/[^0-9]/g, ""));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPackage: true,
          packageDetails: {
            name: plan.name,
            tagline: plan.tagline,
            priceNumeric,
          },
          successUrl: window.location.origin + window.location.pathname,
          cancelUrl: window.location.origin + window.location.pathname,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Stripe package session setup failed.");
        setCheckoutLoading(false);
      }
    } catch (err) {
      console.error("Package checkout processing blocker:", err);
      alert("Network exception contacting payment handler.");
      setCheckoutLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-bold tracking-tighter text-xl animate-pulse border border-white/20">
          G
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-black font-sans pb-32">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-red-500/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold tracking-tighter text-lg animate-pulse border border-white/20">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-lg uppercase bg-gradient-to-r from-white via-red-500 to-white bg-clip-text text-transparent group-hover:via-white transition-all duration-500">
                GTMCE
              </span>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-none">
                Gawthorpe Ting
              </span>
            </div>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider text-white/70">
            <a href="#music" className="hover:text-red-500 transition-colors">CATALOGUE</a>
            <a href="#services" className="hover:text-red-500 transition-colors">STUDIO SERVICES</a>
            <a href="#packages" className="hover:text-red-500 transition-colors">INVESTOR PACKAGES</a>
            <a href="#showcase" className="hover:text-red-500 transition-colors">SHOWCASE</a>
            <a href="#shop" className="hover:text-red-500 transition-colors">FAN STORE</a>
            <a href="#inquire" className="hover:text-red-500 transition-colors">DEMO SUBMIT</a>
            <a href="#faq" className="hover:text-red-500 transition-colors">FAQ</a>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAdminView(!adminView)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                adminView
                  ? "border-red-500 bg-red-500/10 text-red-500 animate-pulse"
                  : "border-white/10 hover:border-red-500 text-white/50 hover:text-white"
              } transition-all`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{adminView ? "CONSOLE: OPEN" : "ADMIN CONSOLE"}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 py-1.5 px-3 rounded-full">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                  alt={user.displayName || "User"}
                  className="w-5 h-5 rounded-full border border-red-500/50"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`;
                  }}
                />
                <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold truncate max-w-[80px]">
                  {user.displayName?.split(" ")[0] || "Artist"}
                </span>
                <button
                  onClick={handleGoogleSignOut}
                  className="text-white/40 hover:text-red-500 text-[10px] font-extrabold font-mono transition-colors border-l border-white/10 pl-2 leading-none cursor-pointer"
                >
                  OUT
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold tracking-wider uppercase rounded-full transition-all border border-white/10 shadow-lg shadow-red-900/10 cursor-pointer"
              >
                LOGIN
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-red-500/15 border border-white/10 text-white hover:text-red-500 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Auth Error Banner notice */}
      {authError && (
        <div className="bg-neutral-950/95 border-b border-red-500/30 backdrop-blur-md sticky top-20 z-30 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-start md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-3">
              <div className="p-1.5 bg-red-600/10 rounded-lg text-red-500 mt-0.5 md:mt-0 shrink-0 border border-red-500/20">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest leading-none">SIGN-IN NOTICE / IFRAME WORKAROUND</span>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {authError}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAuthError(null)}
              className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
              title="Dismiss Notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-white/5">
        
        {/* Decorative Grid Matrix Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.06)_0,transparent_60%)] pointer-events-none" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-72 h-72 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/20 text-red-400 text-[10px] font-extrabold uppercase tracking-widest mb-8 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              It&apos;s a Gawthorpe Ting!
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
              FROM THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-white">UNDERGROUND</span> TO THE MAINSTREAM
            </h1>

            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl">
              GTMCE is not your average corporate record machine. We are a social, artist-first guardian agency giving upcoming stars 100% control, pristine studio tools, and a direct visual launchpad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <a
                href="#music"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm shadow-lg shadow-red-900/30"
              >
                <Play className="w-4 h-4 fill-current" />
                STREAM LATEST TRACKS
              </a>
              <a
                href="#inquire"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white font-bold tracking-wider transition-all text-sm"
              >
                BOOK STUDIO HOUR
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-20 w-full max-w-3xl py-6 px-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div>
                <p className="text-3xl font-black text-white">3M+</p>
                <p className="text-xs text-red-500 tracking-wider font-semibold uppercase mt-1">SoundCloud Plays</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-xs text-red-500 tracking-wider font-semibold uppercase mt-1">Artist Authority</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">0%</p>
                <p className="text-xs text-red-500 tracking-wider font-semibold uppercase mt-1">Slavery Royality</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">24/7</p>
                <p className="text-xs text-red-500 tracking-wider font-semibold uppercase mt-1">Gawthorpe Support</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. AUDIO CATALOGUE & STREAMING PLATFORMS */}
      <section id="music" className="py-24 border-b border-white/5 relative bg-[rgba(2,2,2,1)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-extrabold text-xs uppercase tracking-widest mb-3">
                <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                Latest Releases
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                STREAM THE GTMCE CATALOGUE
              </h2>
            </div>
            <p className="text-white/50 text-base max-w-sm mt-4 md:mt-0">
              Listen to our recent releases. Handcrafted, high-tempo, authentic underground records.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Interactive Simulated SoundCloud Player */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                
                {/* Visual Glow */}
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-red-600/10 blur-[50px] pointer-events-none" />

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-24 h-24 rounded-lg bg-red-950 flex items-center justify-center text-4xl shadow-xl shadow-red-900/10 border border-white/10 relative overflow-hidden group">
                    {currentTrack.image ? (
                      <img src={currentTrack.image} alt={currentTrack.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : null}
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all flex items-center justify-center z-10">
                      <Disc className={`w-12 h-12 text-white/90 ${isPlaying ? "animate-[spin_10s_linear_infinite]" : ""}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="px-2.5 py-0.5 rounded bg-red-600/20 border border-red-500/20 text-red-400 font-bold text-[10px] tracking-wide uppercase">
                      NOW PLAYING
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{currentTrack.title}</h3>
                    <p className="text-white/60 text-sm mt-0.5">{currentTrack.artist}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="text-[11px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                        {currentTrack.genre}
                      </span>
                      <span className="text-[11px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                        BPM: {currentTrack.bpm}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Waveform & Progress Bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs text-white/40">
                    <span>GTMCE Live Audio Stream</span>
                    <span>{trackProgress}% Completed</span>
                  </div>
                  <div className="h-2 bg-neutral-900 rounded-full overflow-hidden relative border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${trackProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-white/40 pt-1">
                    <span className="font-mono">{formatTime(currentTime)}</span>
                    <span className="font-mono">{trackDuration > 0 ? formatTime(trackDuration) : currentTrack.duration}</span>
                  </div>
                </div>

                {/* Track Audio Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePrevTrack}
                      className="p-2 rounded-full hover:bg-white/5 text-white/80 hover:text-white transition-colors"
                      title="Previous Track"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-110 active:scale-95 shadow-md shadow-red-900/20"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                    </button>
                    <button
                      onClick={handleNextTrack}
                      className="p-2 rounded-full hover:bg-white/5 text-white/80 hover:text-white transition-colors"
                      title="Next Track"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Playback speed controller */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">Speed:</span>
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="bg-neutral-900 border border-white/10 px-2 py-1 rounded text-xs focus:outline-none focus:border-red-500 text-white font-semibold"
                    >
                      <option value={1}>1.0x (Standard)</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* SoundCloud banner callout */}
              <div className="p-4 bg-orange-600/10 border border-orange-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📻</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Stream Official SoundCloud Channel</h4>
                    <p className="text-xs text-white/60">Follow GTMCE for exclusive mixtape drops & live drill sessions</p>
                  </div>
                </div>
                <a
                  href="https://soundcloud.com/gawthorpetingmusic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-full uppercase tracking-wider transition-colors shrink-0 font-mono"
                >
                  FOLLOW SOUNDCLOUD
                </a>
              </div>
            </div>

            {/* Catalog List */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-xs text-white/40 uppercase tracking-widest font-extrabold mb-2">Playlist Compilation</h4>
              {CATALOG_TRACKS.map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentTrackIndex === idx
                      ? "bg-red-950/20 border-red-500 text-white"
                      : "bg-white/[0.02] border-white/5 hover:border-white/10 text-white/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded overflow-hidden bg-neutral-900 flex items-center justify-center uppercase font-bold text-xs shrink-0 relative">
                      {track.image ? (
                        <img src={track.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      ) : null}
                      {currentTrackIndex === idx && isPlaying ? (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                          <div className="flex gap-[2px] items-end h-3 w-3">
                            <span className="w-0.5 bg-red-500 animate-[pulse_0.6s_infinite_alternate]" style={{height: '100%'}} />
                            <span className="w-0.5 bg-red-500 animate-[pulse_0.8s_infinite_alternate_0.2s]" style={{height: '60%'}} />
                            <span className="w-0.5 bg-red-500 animate-[pulse_0.4s_infinite_alternate_0.1s]" style={{height: '80%'}} />
                          </div>
                        </div>
                      ) : (
                        !track.image && <Music className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate leading-snug">{track.title}</p>
                      <p className="text-xs text-white/40 truncate mt-0.5">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 bg-white/5 text-[10px] text-white/50 rounded uppercase font-mono">
                      {track.genre}
                    </span>
                    <span className="text-xs text-white/40 font-mono">{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 4. STUDIO SERVICES */}
      <section id="services" className="py-24 border-b border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 bg-red-950/80 border border-red-500/20 rounded-full text-[10px] text-red-400 font-extrabold uppercase tracking-widest">
              GTMCE SERVICES DIVISION
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
              A-GRADE SERVICES & PRECISE VALUE
            </h2>
            <p className="text-white/60 text-base mt-4 font-light">
              Equipped with elite physical treated space, high-end production rigs, and creative artist managers. Keep full control under GTMCE support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((srv, idx) => (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-neutral-950/60 border border-white/5 hover:border-red-500/30 transition-all flex flex-col justify-between group h-full relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black text-red-500 font-mono">{srv.price}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-1 text-white">{srv.title}</h3>
                  <p className="text-xs font-semibold italic text-red-500/80 mb-4">&ldquo;{srv.tagline}&rdquo;</p>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">{srv.description}</p>
                </div>

                <div className="space-y-3.5 pt-6 border-t border-white/5">
                  {srv.features.map((feat, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <CheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-white/80">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <a
                    href="#inquire"
                    onClick={() => setInquiryService(srv.id === "srv_record" ? "record" : srv.id === "srv_master" ? "master" : "partnership")}
                    className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-white/10 hover:border-red-500 text-white font-semibold text-xs transition-colors tracking-wide"
                  >
                    INQUIRE NOW
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ROADMAP & INVESTORS STRATEGIC PACKAGES */}
      <section id="packages" className="py-24 border-b border-white/5 bg-[rgba(1,1,1,1)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7">
              <span className="px-3 py-1 bg-red-950/60 border border-red-500/20 rounded-full text-[10px] text-red-400 font-extrabold uppercase tracking-widest">
                Gawthorpe Roadmap & Digital Scaling
              </span>
              <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
                INVESTOR PACKAGES & REVENUE SYSTEMS
              </h2>
              <p className="text-white/60 text-base mt-4 font-light leading-relaxed">
                By streamlining distribution pipeline operations, GTMCE delivers predictable digital recurring monetization, scalable metadata syndication, and reduced administrative overhead — optimized for private investors, commercial loan desks, and official public arts review boards.
              </p>
            </div>
            <div className="lg:col-span-5 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                Strategic Mainstream Push
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                Rather than solely competing underground, GTMCE aims to transform into a key supportive utility system for other firms and public institutions, driving major commercial appreciation for our direct customers.
              </p>
              <div className="text-xs text-white/40 italic">
                &ldquo;Most importantly and preciously this platform motivates, embarks and achieve more success and appreciation for all our clients, customers and more...&rdquo;
              </div>
            </div>
          </div>

          {/* Investment Packages pricing desks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {INVESTMENT_PLANS.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-8 rounded-2xl border transition-all flex flex-col justify-between h-full relative ${
                  plan.isPopular
                    ? "bg-gradient-to-br from-red-950/20 via-neutral-950 to-black border-red-500 shadow-xl shadow-red-950/10"
                    : "bg-neutral-950 border-white/5"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-8 px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                    RECOMMENDED / HIGH IMPACT
                  </span>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                    <p className="text-xs italic text-red-500 mt-1">&ldquo;{plan.tagline}&rdquo;</p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-white/50">{plan.type}</span>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-6">{plan.description}</p>
                </div>

                <div>
                  <ul className="space-y-3.5 mb-8 pt-6 border-t border-white/5">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-white/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePackageBuy(plan)}
                    disabled={checkoutLoading}
                    className={`w-full inline-flex justify-center items-center py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                      plan.isPopular
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
                  >
                    {checkoutLoading ? "CONTACTING STRIPE..." : "ACQUIRE DEVELOPMENT LICENSE"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* INTERACTIVE 3-YEAR OPERATIONAL ROADMAP */}
          <div className="mt-20 border-t border-white/5 pt-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[10px] text-red-500 font-extrabold tracking-widest uppercase bg-red-950/40 border border-red-500/10 px-3 py-1 rounded-full">
                OPERATIONAL MILESTONES & AUDITING
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-4">
                THE 3-YEAR STRATEGIC PLAN
              </h3>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">
                Click headers to examine yearly execution milestones, copyright protocols, and structural protections designed for GTMCE scale-ups.
              </p>
            </div>

            {/* Year Selector Tabs */}
            <div className="flex justify-center gap-1 max-w-lg mx-auto bg-neutral-900/80 p-1 rounded-xl border border-white/5 mb-8">
              {[
                { id: "1", title: "YEAR ONE", tag: "Foundations & Copyright" },
                { id: "2", title: "YEAR TWO", tag: "Subscription Scale" },
                { id: "3", title: "YEAR THREE", tag: "HQ & Market Hit" },
              ].map((yr) => (
                <button
                  key={yr.id}
                  onClick={() => setActiveYearTab(yr.id)}
                  className={`flex-1 py-3 px-2 rounded-lg text-center transition-all ${
                    activeYearTab === yr.id
                      ? "bg-red-600 text-white font-black border border-red-500/20"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  <span className="block text-xs font-bold font-mono">{yr.title}</span>
                  <span className="block text-[8px] tracking-wider uppercase mt-0.5 opacity-60 leading-none">{yr.tag}</span>
                </button>
              ))}
            </div>

            {/* Active Year Milestone Content */}
            <div className="bg-neutral-950 border border-white/5 p-8 rounded-2xl max-w-4xl mx-auto">
              {activeYearTab === "1" && (
                <div className="space-y-6">
                  <div className="flex border-b border-white/5 pb-4 items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">YEAR 1 BENCHMARKS: GROUNDWORK & COPYRIGHT PROTOCOLS</h4>
                      <p className="text-xs text-white/50 mt-1">Establishing the foundational infrastructure, copyright protections, and commercial templates.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-mono text-[10px] font-bold">STAGE 1</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/70 leading-relaxed">
                    <div className="space-y-4">
                      <div>
                        <strong className="text-white block font-bold mb-1">1. Own Advertisement & Organic Exposure</strong>
                        Establishing a solid digital footprint through low-cost distribution networks, organic social campaigns, local flyers, street-level busking, and artist-driven online networks.
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-1">2. Bulletproof Split Sheets & Legal Templates</strong>
                        Drafting robust, industry-standard royalty and split sheet agreement templates to protect GTMCE and our artists early on.
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-1">3. Trademarking & Official Incorporation</strong>
                        Securing official trademark registries and incorporating GTMCE as an authorized, shielded commercial music organization in West Yorkshire.
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <strong className="text-white block font-bold mb-1">4. Dedicated Business Checking Setup</strong>
                        Establishing clean corporate, fully audited business banking lines to isolate all seed capital and development grants.
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-1">5. Streaming Platforms Alignment</strong>
                        Defining strict metadata and intellectual property monitoring guidelines with Spotify, Apple Music, and SoundCloud to completely safeguard distribution assets.
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-1">6. Triple Artist Signings (Dark Horse Strategy)</strong>
                        Targeting 3 talented homegrown acts or focusing branding on a single organic &quot;Dark Horse&quot; brand to capture local spotlight.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeYearTab === "2" && (
                <div className="space-y-6">
                  <div className="flex border-b border-white/5 pb-4 items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">YEAR 2 BENCHMARKS: TALENT INVESTMENT & SUBSCRIPTIONS</h4>
                      <p className="text-xs text-white/50 mt-1">Expanding regional representation and moving digital merchandise operations to a globally unified system.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-mono text-[10px] font-bold">STAGE 2</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/70 leading-relaxed">
                    <div className="space-y-4">
                      <div>
                        <strong className="text-white block font-bold mb-1">1. Dual Domestic Artist Acquisitions</strong>
                        Signing and investing in 2 proven domestic talents with existing spot popularity, leveraging our newly constructed production pipelines.
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-1">2. Online Merch Deployment</strong>
                        Publishing a full physical collection of custom clothing, vintage vinyl records, and stickers, managing distribution globally through our central store interface (Sizes XS to XXXL).
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <strong className="text-white block font-bold mb-1">3. Educational & College College Activation Trips</strong>
                        Directly networking with university music, creative art, and media departments to form defensive partnerships alongside grass-roots initiatives like &quot;Hear Me Out&quot;.
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-1">4. Custom Production Workspace & Equipment</strong>
                        Establishing a treating acoustics office/lab loaded with high-quality recording machines to service clients under strict family-friendly, professional standards.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeYearTab === "3" && (
                <div className="space-y-6">
                  <div className="flex border-b border-white/5 pb-4 items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">YEAR 3 BENCHMARKS: MASS HQ & VIRAL REVENUE REACH</h4>
                      <p className="text-xs text-white/50 mt-1">Establishing high-throughput studio physical offices and pushing directly for massive mainstream viral traction.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-mono text-[10px] font-bold">STAGE 3</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/70 leading-relaxed">
                    <div className="space-y-4">
                      <div>
                        <strong className="text-white block font-bold mb-1">1. Direct-Bypass Creator Subscription Suite</strong>
                        Offering standard cloud dashboard subscription tools letting underground creators directly catalog, register, and sync metadata without exploitative gatekeepers.
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-1">2. Launching GTMCE Yorkshire HQ</strong>
                        Inaugurating our central physical administrative office and flagship engineering recording workspace in West Yorkshire.
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <strong className="text-white block font-bold mb-1">3. Heavy City Billboard Campaigns</strong>
                        Partnering with regional advertising groups to run physical billboard arrays and mass street ads in core metropolitan spots.
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-1">4. The Mainstream Breakthrough hit Single</strong>
                        Aligning GTMCE production engineers, digital channels, and PR budgets to strategically trigger a top-tier viral streaming hit.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DIGITAL SUBSCRIPTION ASSUMPTIONS DOCK */}
            <div className="mt-12 bg-neutral-950 border border-white/5 p-8 rounded-2xl max-w-4xl mx-auto">
              <div className="border-b border-white/5 pb-4 mb-6">
                <span className="text-[10px] text-red-500 font-bold font-mono tracking-wider uppercase">REVENUE MODEL SHIPPED ASSUMPTIONS</span>
                <h4 className="text-sm font-black text-white mt-1 font-mono">ASSUMED RESILIENT REVENUE CHANNELS (0.5% UPTAKE TARGET)</h4>
                <p className="text-xs text-white/50 mt-1">Projected yield levels modeling standard subscription suites across 200,000 university/college candidates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { name: "THE STARTER SUITE", tagline: '"It\'ll all be alR8"', price: "£30.00/yr", target: "1,000 signups (0.5%)", revenue: "£30,000" },
                  { name: "BETTER DEAL PROGRESS", tagline: '"Better than 360-deal"', price: "£60.00/yr", target: "1,000 signups (0.5%)", revenue: "£60,000" },
                  { name: "FINE FOR U GRADUATE", tagline: '"Fine for U-graduates"', price: "£90.00/yr", target: "1,000 signups (0.5%)", revenue: "£90,000" },
                  { name: "FAMILY PLATINUM", tagline: '"Streaming Running Millions"', price: "£100.00 - £300.00/yr", target: "1,000 signups (0.5%)", revenue: "£100,000+" },
                ].map((tier, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl hover:border-red-500/20 transition-all flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-black text-white leading-none">{tier.name}</h5>
                      <span className="block text-[8px] text-red-500 font-mono italic mt-1">{tier.tagline}</span>
                    </div>
                    <div className="mt-6 border-t border-white/5 pt-4 space-y-2">
                      <div className="flex justify-between items-baseline text-[10px] text-white/50">
                        <span>Cost:</span>
                        <span className="text-white font-mono font-bold">{tier.price}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-[10px] text-white/50">
                        <span>Target Conversion:</span>
                        <span className="text-white font-mono">{tier.target}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-[10px] text-white/50 border-t border-white/5 pt-2">
                        <span className="font-bold text-white/70 text-[10px]">Projected Yield:</span>
                        <span className="text-red-500 font-mono font-bold">{tier.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <section id="about" className="py-24 border-b border-white/5 bg-[rgba(1,1,1,1)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src="/work-1.jpg" 
                alt="Jonathan Lokondo Djamba - CEO" 
                layout="responsive"
                width={800} 
                height={800} 
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-2xl font-black text-white">Jonathan Lokondo Djamba</h3>
                <p className="text-red-500 text-sm font-bold tracking-widest uppercase mt-1">CEO OF G.T.M.C.E</p>
              </div>
            </div>

            <div className="space-y-6 text-white/70 leading-relaxed font-light text-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                <div className="h-0.5 w-12 bg-red-600/50"></div>
                <span className="text-red-500 font-bold uppercase tracking-widest text-xs">ABOUT GAWTHORPE TING</span>
              </div>
              
              <p>
                At Gawthorpe Ting Music, Content & Entertainment (G.T.M.C.E) we are dedicated to celebrating the vibrant world of music. Our team is passionate about connecting talented artists with audiences, ensuring unforgettable experiences at every moment.
              </p>
              
              <p>
                We are specialise in excellent collaborations work/projects and managing various artists/talents from the United Kingdom. The music is unique and has influences of R&B, Rap/HipHop, Grime, House, Dance, US/UK Drill, Punk/Alternative music.
              </p>
              
              <p>
                Networking with various organisations and professional staff(s) in the aims to continue to grow our fun music-making and bass loving community. Follow us on our journey of trying to serve the whole world with a different type of mix-genres by our awesome homegrown talents.
              </p>

              <blockquote className="mt-8 border-l-4 border-red-600 pl-6 py-2">
                <p className="text-xl font-medium text-white italic mb-2">
                  &quot;It&apos;s a Gawthorpe Ting!&quot; &copy;
                </p>
                <footer className="text-sm">
                  <strong className="text-white">- Jonathan Lokondo Djamba</strong><br/>
                  <span className="text-white/40 uppercase tracking-widest text-xs">~ G.T.M.C.E ~</span>
                </footer>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      <section id="showcase" className="py-24 border-b border-white/5 bg-[rgba(2,2,2,1)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-0.5 w-8 bg-red-600"></div>
                <span className="text-red-500 font-bold uppercase tracking-widest text-xs">PORTFOLIO & EVOLUTION</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                STUDIO <span className="text-red-600 font-light">SHOWCASE</span>
              </h2>
              <p className="mt-6 text-white/50 max-w-2xl leading-relaxed text-sm">
                Visual documentation of recent studio sessions, system achievements, and milestones. Switch tabs below to witness our live development timeline and archive!
              </p>
            </div>
            
            {/* Elegant Tab Switcher */}
            <div className="flex gap-2 bg-neutral-950 p-1.5 rounded-full border border-white/5 self-start shrink-0">
              <button
                onClick={() => setPortfolioTab("progress")}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  portfolioTab === "progress"
                    ? "bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                Progress Timeline ⚡
              </button>
              <button
                onClick={() => setPortfolioTab("archive")}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  portfolioTab === "archive"
                    ? "bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                Studio Archive 📂
              </button>
            </div>
          </div>

          {portfolioTab === "progress" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  src: "/Overview1.png", 
                  title: "Milestone 1: Structural Seeding", 
                  desc: "Designing the core responsive views, gorgeous Inter & Space Grotesk pairings, and high-contrast styling." 
                },
                { 
                  src: "/Overview2.png", 
                  title: "Milestone 2: Soundcloud Sync", 
                  desc: "Sourcing verified audio data schemas, artwork catalogs, and official stream pathways." 
                },
                { 
                  src: "/Overview3.png", 
                  title: "Milestone 3: Persistent Soundbar", 
                  desc: "Creating state-authoritative audio controllers, interactive seek tracks, and vinyl rotational animations." 
                },
                { 
                  src: "/Overview4.png", 
                  title: "Milestone 4: Storefront & Cart Engine", 
                  desc: "Deploying interactive merchandise showrooms, dynamic side carts, and sizing metrics guides." 
                },
                { 
                  src: "/Overview5.png", 
                  title: "Milestone 5: Stripe Integration", 
                  desc: "Configuring premium checkout sessions securely with localized payment gateways and forms." 
                },
                { 
                  src: "/Overview6.png", 
                  title: "Milestone 6: Micro-Interactions", 
                  desc: "Polishing hover sweep beams, parallax visualizers, and state-gated layout animations." 
                },
                { 
                  src: "/Overview7.png", 
                  title: "Milestone 7: Production Audit", 
                  desc: "Validating compiler boundaries, asset loading LCP benchmarks, and resilient data routing." 
                }
              ].map((item, idx) => (
                <ShowcaseImageCard 
                  key={idx} 
                  src={item.src} 
                  idx={idx} 
                  title={item.title} 
                  desc={item.desc} 
                />
              ))}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {[
                "/work-1.jpg",
                "/work-2.jpeg",
                "/work-3.jpg",
                ...Array.from({ length: 25 }, (_, i) => `/work-${i + 4}.png`)
              ].map((src, idx) => (
                <ShowcaseImageCard key={idx} src={src} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. SHOP SECTION & CART SYSTEM */}
      <section id="shop" className="py-24 border-b border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="px-3 py-1 bg-red-950/60 border border-red-500/20 rounded-full text-[10px] text-red-400 font-extrabold uppercase tracking-widest">
                GTMCE MERCHANDISE
              </span>
              <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
                THE OFFICAL TIN STORE
              </h2>
            </div>
            
            {/* Tab Filters */}
            <div className="flex gap-2 mt-6 md:mt-0 bg-neutral-900 p-1.5 rounded-full border border-white/5 self-start">
              {["all", "Apparel", "Music", "Tickets"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === t
                      ? "bg-red-600 text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {t === "all" ? "SHOW ALL" : t}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Feature: Apparel T-Shirt Show Off */}
          {(activeTab === "all" || activeTab === "Apparel") && (
            <div className="bg-neutral-950/60 border border-white/5 rounded-3xl p-6 md:p-10 mb-16 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Image gallery */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="w-full aspect-square md:h-[450px] rounded-2xl bg-neutral-950 border border-white/5 overflow-hidden relative shadow-inner group flex items-center justify-center">
                    <motion.img
                      key={activeTshirtView}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      src={activeTshirtView}
                      alt="G.T.M.C.E Signature T-shirt View"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  
                  {/* Thumbnails list */}
                  <div className="flex gap-4">
                    {[
                      { id: 1, src: "/T-shirt_view1.png", label: "Front View" },
                      { id: 2, src: "/T-shirt_view2.png", label: "Model Wear View 1" },
                      { id: 3, src: "/T-shirt_view3.png", label: "Model Wear View 2" }
                    ].map((thumb) => (
                      <button
                        key={thumb.id}
                        onClick={() => setActiveTshirtView(thumb.src)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeTshirtView === thumb.src
                            ? "border-red-600 scale-102 shadow-lg shadow-red-900/20"
                            : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                        }`}
                      >
                        <img
                          src={thumb.src}
                          alt={thumb.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Column: Details & Operations */}
                <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
                  <div>
                    <span className="text-red-500 font-extrabold tracking-widest text-[11px] uppercase block mb-3 font-mono">
                      APPAREL
                    </span>
                    <h1 className="text-3xl md:text-[40px] font-black text-white tracking-tight uppercase leading-tight">
                      G.T.M.C.E Signature T-shirt
                    </h1>
                    <div className="flex items-baseline gap-4 mt-4">
                      <span className="text-3xl font-black text-white">£25.00</span>
                      <span className="text-[10px] text-red-500 bg-red-950/40 border border-red-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                        IN STOCK
                      </span>
                    </div>
                    <p className="mt-6 text-sm text-zinc-300 leading-relaxed max-w-xl font-sans">
                      Our signature heavyweight cotton t-shirt featuring the iconic Gawthorpe Ting Music logo. Designed for comfort and style, whether you&apos;re in the studio or on the streets.
                    </p>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-4">
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
                      SELECT SIZE
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {["S", "M", "L", "XL", "XXL"].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedTshirtSize(sz)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold transition-all cursor-pointer border ${
                            selectedTshirtSize === sz
                              ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-900/30 scale-105"
                              : "bg-neutral-900 text-white/70 border-white/5 hover:border-white/20 hover:bg-neutral-800"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        const tshirtItem = {
                          id: "prod_sig_tshirt",
                          name: `G.T.M.C.E Signature T-shirt [${selectedTshirtSize}]`,
                          price: 25.00,
                          category: "Apparel",
                          image: "👕",
                          imageUrl: "/T-shirt_view1.png"
                        };
                        addToCart(tshirtItem as any);
                      }}
                      className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-extrabold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-red-950/45 border border-white/10 font-mono"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      ADD TO BASKET
                    </button>

                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="py-4 px-6 bg-transparent hover:bg-white/5 text-white border border-white/10 hover:border-white/30 font-bold text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer font-mono"
                    >
                      SIZE GUIDE
                    </button>
                  </div>

                  {/* Additional Info Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/5">
                      <span className="text-[10px] font-mono font-extrabold text-red-500 uppercase tracking-widest block mb-1">
                        FREE UK SHIPPING
                      </span>
                      <p className="text-xs text-zinc-400">On apparel orders over £50</p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/5">
                      <span className="text-[10px] font-mono font-extrabold text-red-500 uppercase tracking-widest block mb-1">
                        SECURE PAYMENT
                      </span>
                      <p className="text-xs text-zinc-400">SSL Encrypted Stripe Checkout</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Shop Item Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {SHOP_ITEMS.filter((itm) => activeTab === "all" || itm.category === activeTab).map((item) => (
              <div
                key={item.id}
                className="bg-neutral-950 border border-white/5 rounded-2xl p-5 hover:border-red-500/30 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 transform flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-44 rounded-xl bg-gradient-to-br from-neutral-900 to-black border border-white/5 flex items-center justify-center text-5xl mb-4 shadow-inner relative overflow-hidden group">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div className="relative z-10 drop-shadow-lg">{item.image}</div>
                    <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] text-red-500 uppercase tracking-widest font-extrabold">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed mb-4 h-16 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-black text-white">£{item.price.toFixed(2)}</span>
                    <span className="text-[10px] text-white/40 tracking-wider">
                      Stock: {item.stock} left
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white border border-white/10 hover:border-red-600 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    ADD TO BASKET
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. REVOLUTIONARY BOOKING & DEMO INQUIRY FORM */}
      <section id="inquire" className="py-24 border-b border-white/5 bg-[rgba(2,2,2,1)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Explanatory Side card */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="px-3 py-1 bg-red-950/60 border border-red-500/20 rounded-full text-[10px] text-red-400 font-extrabold uppercase tracking-widest">
                  GET IN TOUCH
                </span>
                <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
                  SUBMIT DEMOS & BOOK HOURS
                </h2>
                <p className="text-white/60 text-base mt-4 font-light leading-relaxed">
                  Have a raw track that is ready for digital syndication, or want to lock down high-fidelity studio recording time under GTMCE management? Fill out the portal and the Gawthorpe Ting crew will evaluate your record within 24 hours.
                </p>
              </div>

              {/* Direct Info details */}
              <div className="space-y-4 pt-6">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-red-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-white/40 uppercase tracking-widest font-extrabold">Studio Location</h4>
                    <p className="text-sm font-semibold text-white mt-0.5">Gawthorpe, Ossett, West Yorkshire</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-red-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-white/40 uppercase tracking-widest font-extrabold">Direct Email</h4>
                    <p className="text-sm font-semibold text-white mt-0.5">booking@gtmce-ting.com</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-red-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-white/40 uppercase tracking-widest font-extrabold">Telephone Line</h4>
                    <p className="text-sm font-semibold text-white mt-0.5">+44 (0) 7942 581930</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Portal Action Form */}
            <div className="lg:col-span-7">
              <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-b from-neutral-900 to-black border-2 border-red-500/20 shadow-2xl relative">
                
                <h3 className="text-2xl font-bold mb-2">GTMCE SECURE SUBMISSION PORTAL</h3>
                <p className="text-white/50 text-xs mb-8">Enter correct identity coordinates to trigger system evaluation desk.</p>

                {inquirySuccess ? (
                  <div className="p-6 bg-red-950/20 border border-red-500 rounded-xl text-center space-y-4 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl mx-auto font-bold">
                      ✓
                    </div>
                    <h4 className="text-xl font-bold text-white">Demo Submitted Successfully!</h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      We&apos;ve logged your track into our internal desk review queue. We inspect every demo submission. Rest assured, we retain zero claims unless a joint agreement is countersigned.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white/70 tracking-wider uppercase">Artist / Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="e.g. MC Double-M"
                          className="w-full bg-black/55 border border-white/10 focus:border-red-500 px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white/70 tracking-wider uppercase">Contact Email Address *</label>
                        <input
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="e.g. doublem@gmail.com"
                          className="w-full bg-black/55 border border-white/10 focus:border-red-500 px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white/70 tracking-wider uppercase">Select Target Division</label>
                        <select
                          value={inquiryService}
                          onChange={(e) => setInquiryService(e.target.value)}
                          className="w-full bg-black border border-white/10 focus:border-red-500 px-4 py-3 rounded-xl text-sm text-white/80 focus:outline-none transition-colors"
                        >
                          <option value="record">A-Grade Recording Suite (£40/hr)</option>
                          <option value="master">Premium Mixing & Mastering (£120/track)</option>
                          <option value="partnership">GTMCE Guardian Partnership Plan</option>
                          <option value="demo">Free Demotape Evaluation</option>
                          <option value="investment">Strategic Investment Syndicate</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white/70 tracking-wider uppercase">Demo SoundCloud/Drive Link</label>
                        <input
                          type="url"
                          value={inquiryLink}
                          onChange={(e) => setInquiryLink(e.target.value)}
                          placeholder="https://soundcloud.com/..."
                          className="w-full bg-black/55 border border-white/10 focus:border-red-500 px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/70 tracking-wider uppercase">Describe Your Musical Goals & Project Details</label>
                      <textarea
                        rows={4}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Tell us about yourself and what you plan to accomplish..."
                        className="w-full bg-black/55 border border-white/10 focus:border-red-500 px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={inquiryLoading}
                      className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider uppercase text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      {inquiryLoading ? "TRANSMITTING TO GAWTHORPE..." : "SUBMIT PORTAL INQUIRY"}
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-24 border-b border-white/5 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <span className="px-3 py-1 bg-red-950/60 border border-red-500/20 rounded-full text-[10px] text-red-400 font-extrabold uppercase tracking-widest">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
              FREQUENTLY RESOLVED INQUIRIES
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center transition-colors hover:text-red-500 focus:outline-none"
                >
                  <span className="font-bold text-base md:text-lg pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-red-500 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    openFaq === idx ? 'max-h-96 border-t border-white/5' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 text-sm text-white/60 leading-relaxed font-light">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. GTMCE INQUIRY & BOOKING DASHBOARD */}
      {adminView && (
        <section className="py-12 bg-neutral-950 border-t border-red-500/20 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <h2 className="text-xl font-black tracking-wider uppercase text-red-500">
                  GTMCE INQUIRY & BOOKING DASHBOARD
                </h2>
              </div>
              <button
                onClick={() => setAdminView(false)}
                className="p-1 px-3 bg-white/5 text-white/50 text-xs font-bold uppercase rounded-lg border border-white/10 hover:text-white hover:border-red-500 transition-all"
              >
                Close Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="p-5 bg-black border border-white/5 rounded-xl">
                <h3 className="text-xs text-white/40 uppercase tracking-widest font-extrabold mb-2">TOTAL PORTAL VISITS</h3>
                <p className="text-3xl font-black text-white">{siteVisits}</p>
                <p className="text-[10px] text-white/40 mt-1">Live tracking state</p>
              </div>

              <div className="p-5 bg-black border border-white/5 rounded-xl">
                <h3 className="text-xs text-white/40 uppercase tracking-widest font-extrabold mb-2">ONLINE LISTENERS</h3>
                <p className="text-3xl font-black text-white">{activeSessions}</p>
                <p className="text-[10px] text-green-400 mt-1">Interactive sessions</p>
              </div>

              <div className="p-5 bg-black border border-white/5 rounded-xl">
                <h3 className="text-xs text-white/40 uppercase tracking-widest font-extrabold mb-2">GTMCE STREAM PLAYS</h3>
                <p className="text-3xl font-black text-white">{soundCloudPlays}</p>
                <p className="text-[10px] text-white/40 mt-1">Accumulated demo streams</p>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Submission queue */}
              <div className="p-6 bg-black border border-white/5 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  Live Booking & Demo Pipeline ({submissions.length})
                </h3>
                {submissions.length === 0 ? (
                  <p className="text-xs text-white/30 italic py-8 text-center">No active inquiries. Test the main form to populate immediately.</p>
                ) : (
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="p-4 bg-neutral-950 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-white">{sub.name}</h4>
                            <p className="text-xs text-white/50">{sub.email}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-[10px] font-bold uppercase rounded">
                            {sub.service}
                          </span>
                        </div>
                        {sub.link !== "N/A" && (
                          <p className="text-xs text-red-500 truncate underline mt-2">
                            {sub.link}
                          </p>
                        )}
                        <p className="text-xs text-white/70 mt-3 italic font-light">
                          &ldquo;{sub.message || "No custom message provided."}&rdquo;
                        </p>
                        <div className="text-[10px] text-white/30 text-right mt-2 font-mono">
                          Submitted: {sub.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* GTMCE Fan Store Order History */}
              <div className="p-6 bg-black border border-white/5 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-500" />
                  Fan Store Order Portal History ({orders.length})
                </h3>
                {orders.length === 0 ? (
                  <p className="text-xs text-white/30 italic py-8 text-center">No transactions registered yet. Try adding store products to basket and click checkout.</p>
                ) : (
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                    {orders.map((ord) => (
                      <div key={ord.id} className="p-4 bg-neutral-950 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-red-500">{ord.id}</h4>
                            <p className="text-xs text-white/30">{ord.timestamp}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase font-bold rounded">
                            Approved
                          </span>
                        </div>
                        <div className="mt-3 space-y-1">
                          {ord.items.map((it: any, j: number) => (
                            <div key={j} className="flex justify-between text-xs">
                              <span className="text-white/70">{it.name} (x{it.quantity})</span>
                              <span className="text-white font-mono">£{(it.price * it.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-white/5 mt-3 pt-3 flex justify-between text-sm font-bold text-white">
                          <span>Total Amount Processed</span>
                          <span>£{ord.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 10. BASKET / ACCORDION DRAWER MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-neutral-950 border-l border-white/10 h-full flex flex-col justify-between shadow-2xl relative">
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-red-500 animate-pulse" />
                <h3 className="font-bold text-lg">YOUR BASKET</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-white/35">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-white/10" />
                  <p className="text-sm">Your basket is currently empty.</p>
                  <p className="text-xs text-white/20 mt-1">Browse our exclusive fan store releases.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-4 bg-black border border-white/5 rounded-xl flex justify-between items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{item.name}</p>
                      <p className="text-xs text-red-500 font-mono mt-0.5">£{item.price.toFixed(2)} &times; {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/40 hover:text-red-500 text-xs font-semibold px-2 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-black/40 space-y-4">
                <div className="flex justify-between text-base font-bold text-white">
                  <span>Grand Total</span>
                  <span className="text-red-500 font-mono">£{totalCartAmount}</span>
                </div>
                <div className="flex items-center gap-2 py-2.5 px-3 bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] rounded-lg">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-red-500" />
                  <span>Interactive Mock SECURE stripe payment system. No actual credit details requested.</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? "CONTACTING STRIPE..." : "SECURE CHECKOUT VIA STRIPE"}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 11. PERSISTENT LOWER DECK AUDIO BAR PLAYER (SOUNDCLOUD FLOATING PLAYER) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-md border-t border-red-500/10 py-4 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Active play mini banner */}
          <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
            <div className="w-12 h-12 bg-neutral-900 rounded-lg overflow-hidden border border-white/10 shrink-0 relative flex items-center justify-center">
              {currentTrack.image ? (
                <img 
                  src={currentTrack.image} 
                  alt="" 
                  className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? "animate-[spin_20s_linear_infinite]" : ""}`} 
                />
              ) : (
                <Disc className="w-6 h-6 text-red-500 animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
              <p className="text-xs text-white/50 truncate mt-0.5">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Quick Simulated play controllers */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-center">
            <button
              onClick={handlePrevTrack}
              className="text-white/55 hover:text-red-500 transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-all transform hover:scale-105"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={handleNextTrack}
              className="text-white/55 hover:text-red-500 transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-white/40" />
              <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-4/5" />
              </div>
            </div>
          </div>

          {/* Call to action links */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] text-red-500 tracking-wider font-extrabold uppercase animate-pulse">
              ● IT&apos;S A GAWTHORPE TING!
            </span>
            <a
              href="#inquire"
              className="px-4 py-2 bg-white/5 hover:bg-red-600 hover:text-white border border-white/10 hover:border-red-600 text-xs font-bold uppercase rounded-full transition-all"
            >
              FREE PRODUCTION DEMO SUBMIT
            </a>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-black/80 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-white uppercase tracking-wider">
              GTMCE ENTERTAINMENT
            </p>
            <p className="text-xs text-white/40 mt-1">
              &copy; 2026 GTMCE Entertainment Ltd. All Rights Reserved. Custom Web Integration.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-end">
            <a href="/contract-1.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-red-500 transition-colors uppercase font-mono">Royalty Agreement</a>
            <span className="text-white/20">&bull;</span>
            <a href="/contract-2.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-red-500 transition-colors uppercase font-mono">Artist Contract</a>
            <span className="text-white/20">&bull;</span>
            <a href="#faq" className="text-xs text-white/50 hover:text-red-500 transition-colors uppercase font-mono">HELP & FAQ</a>
            <span className="text-white/20">&bull;</span>
            <span className="text-xs text-white/50 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
              It&apos;s a Gawthorpe Ting!
            </span>
          </div>
        </div>
      </footer>

      {/* GTMCE APPAREL SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-neutral-950 border border-white/10 p-6 md:p-8 rounded-3xl relative shadow-2xl space-y-6">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-neutral-800 text-white/60 hover:text-white rounded-full border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className="text-red-500 font-extrabold tracking-widest text-[10px] uppercase block font-mono">
                FITMENT & MEASUREMENTS
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                GTMCE APPAREL SIZE GUIDE
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                All measurements refer to garment dimensions in centimeters (cm). Our standard streetwear garments feature a relaxed, modern heavy fitting.
              </p>
            </div>

            <div className="overflow-x-auto bg-black/40 border border-white/5 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-zinc-300 font-bold uppercase font-mono tracking-wider">
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest (Width)</th>
                    <th className="p-3">Body Length</th>
                    <th className="p-3">Sleeve Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300 font-mono">
                  <tr>
                    <td className="p-3 font-bold text-white">S</td>
                    <td className="p-3">54 cm</td>
                    <td className="p-3">71 cm</td>
                    <td className="p-3">22 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">M</td>
                    <td className="p-3">57 cm</td>
                    <td className="p-3">73 cm</td>
                    <td className="p-3">23 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">L</td>
                    <td className="p-3">60 cm</td>
                    <td className="p-3">75 cm</td>
                    <td className="p-3">24 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">XL</td>
                    <td className="p-3">63 cm</td>
                    <td className="p-3">77 cm</td>
                    <td className="p-3">25 cm</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">XXL</td>
                    <td className="p-3">66 cm</td>
                    <td className="p-3">79 cm</td>
                    <td className="p-3">25.5 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 items-center p-4 rounded-xl bg-neutral-900/30 border border-white/5 text-xs text-zinc-400 leading-relaxed font-sans">
              <span className="text-red-500 font-bold">PRO TIP:</span>
              <span>For an oversized boxy signature aesthetic, we recommend ordering one size larger than your usual fit!</span>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-widest uppercase rounded-xl transition-all font-mono"
            >
              CLOSE CHART
            </button>
          </div>
        </div>
      )}

      {/* STRIPE CHECKOUT SUCCESS ALERT MODAL */}
      {activeOrderNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-gradient-to-b from-neutral-900 to-black border-2 border-red-500/40 p-8 rounded-3xl relative shadow-2xl space-y-6 text-center animate-scale-up">
            <button
              onClick={() => setActiveOrderNotification(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center rounded-full text-3xl font-black mx-auto animate-bounce border border-white/20 shadow-md shadow-red-950">
              ✓
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                GTMCE ORDER APPROVED!
              </h3>
              <p className="text-[11px] text-red-500 font-bold uppercase tracking-widest font-mono">
                {activeOrderNotification.status} ● SECURE STRIPE HANDSHAKE
              </p>
              <p className="text-xs text-white/60 leading-relaxed max-w-sm mx-auto">
                Thank you! Your transaction has been registered and verified. The Gawthorpe Ting Syndicate and logistics crew will handle dispatching shortly.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-left divide-y divide-white/5 space-y-3">
              <div className="pb-2.5 flex justify-between text-xs">
                <span className="text-white/40 uppercase font-bold">Transaction Reference</span>
                <span className="font-mono text-red-500 font-semibold">{activeOrderNotification.id}</span>
              </div>
              <div className="py-2.5 space-y-1">
                <p className="text-[10px] text-white/30 uppercase font-bold">Processed Items</p>
                {activeOrderNotification.items.map((it: any, j: number) => (
                  <div key={j} className="flex justify-between text-xs">
                    <span className="text-white/80">{it.name} (x{it.quantity || 1})</span>
                    <span className="font-mono text-white">£{Number(it.price * (it.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2.5 flex justify-between text-sm font-bold text-white">
                <span className="uppercase">Grand Amount</span>
                <span className="text-red-500 font-mono">£{activeOrderNotification.total}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveOrderNotification(null)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-widest uppercase rounded-xl transition-colors cursor-pointer"
            >
              CONTINUE HARMONISING
            </button>
          </div>
        </div>
      )}
      
      <AiChat />
    </div>
  );
}
