import { useEffect, useState } from "react";
import { useStore } from "../context/useStore";
import { generateInsights } from "../services/ai/insights";
import { getAIInsights } from "../services/ai/insightsEngine";

import StatCard from "../components/ui/StatCard";
import RevenueChart from "../components/ui/RevenueChart";
import Card from "../components/ui/Card";

import { DollarSign, Users, ShoppingCart, Activity, Search, TrendingUp, Sparkles, Zap, MessageSquare } from "lucide-react";

import { subscribeStats } from "../services/api/stats";
import { subscribeCustomersCount } from "../services/api/customers";
import { subscribeArticles } from "../services/api/articles";
import { createFikoPayment } from "../services/payments/fiko";
import { Article } from "../types/seo";
import NeuralFeed from '../components/seo/NeuralFeed';
import Button from '../components/ui/Button';

export default function Home() {
  const { companyId } = useStore();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    chartData: [] as any[],
    customers: 0,
    transactions: 0,
    articles: [] as Article[],
  });

  const [aiInsight, setAiInsight] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 PAYMENT
  const handleCreatePayment = async () => {
    try {
      const res = await createFikoPayment(companyId, {
        amount: 10000,
      });

      alert("Lien de paiement: " + res.paymentLink);
    } catch (error) {
      console.error("❌ Payment error:", error);
    }
  };

  // 🔥 DATA (Firestore)
  useEffect(() => {
    if (!companyId) return;

    const unsubscribeStats = subscribeStats(companyId, (data) => {
      setStats((prev) => ({
        ...prev,
        totalRevenue: data.totalRevenue,
        chartData: data.chartData,
        transactions: data.chartData.length,
      }));

      setLoading(false);
    });

    const unsubscribeCustomers = subscribeCustomersCount(
      companyId,
      (count) => {
        setStats((prev) => ({
          ...prev,
          customers: count,
        }));
      }
    );

    const unsubscribeArticles = subscribeArticles(
      companyId,
      (articles) => {
        setStats((prev) => ({
          ...prev,
          articles,
        }));
      }
    );

    return () => {
      unsubscribeStats();
      unsubscribeCustomers();
      unsubscribeArticles();
    };
  }, [companyId]);

  // 🔥 LOCAL AI (fast insights)
  useEffect(() => {
    setInsights(
      generateInsights({
        customers: stats.customers,
        revenue: stats.totalRevenue,
        transactions: stats.transactions,
      })
    );
  }, [stats]);

  // 🔥 GEMINI AI (advanced insights)
  useEffect(() => {
    if (!stats.totalRevenue && !stats.customers) return;

    const fetchAI = async () => {
      try {
        const result = await getAIInsights({
          revenue: stats.totalRevenue,
          customers: stats.customers,
          transactions: stats.transactions,
        });

        setAiInsight(result);
      } catch (error) {
        console.error("❌ AI Error:", error);
      }
    };

    fetchAI();
  }, [stats]);

  const seoStats = {
    avgScore: Math.round(stats.articles.reduce((acc, a) => acc + (a.seoScore || 0), 0) / (stats.articles.length || 1)),
    estimatedTraffic: stats.articles.length * 450, // Simulation
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
         <div className="h-10 w-64 bg-surface animate-pulse rounded-lg" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-surface animate-pulse rounded-xl" />)}
         </div>
         <div className="h-96 bg-surface animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-end pb-2">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Control Tower</h1>
          <p className="text-muted text-sm">Welcome back. Here's what's happening today.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
             <TrendingUp size={16} /> Export
          </Button>
          <Button className="flex items-center gap-2" onClick={handleCreatePayment}>
            <Zap size={16} fill="currentColor" /> Create Payment
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue"
          value={`${stats.totalRevenue.toLocaleString()} FCFA`}
          trend="+12%"
          icon={<DollarSign size={20} />}
        />
        <StatCard
          title="SEO Pages"
          value={stats.articles.length.toString()}
          trend={`+${stats.articles.filter(a => a.status === 'published').length}`}
          icon={<Search size={20} />}
        />
        <StatCard
          title="Est. Traffic"
          value={`${(seoStats.estimatedTraffic / 1000).toFixed(1)}k`}
          trend="+8.1%"
          icon={<Activity size={20} />}
        />
        <StatCard
          title="Avg SEO Score"
          value={`${seoStats.avgScore}%`}
          trendUp={seoStats.avgScore > 80}
          trend={seoStats.avgScore > 80 ? "Optimized" : "Needs work"}
          icon={<Sparkles size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <RevenueChart data={stats.chartData} />
           
           {/* 🔥 AI INSIGHTS */}
           <Card className="relative overflow-hidden border-primary/20 bg-primary/5">
             <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase tracking-widest text-[10px]">
               <Sparkles size={14} className="animate-pulse" />
               Advanced Insights
             </div>
             <div className="text-sm leading-relaxed whitespace-pre-line text-ink/80 italic">
               "{aiInsight || "Analyzing your data ecosystem..."}"
             </div>
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
           </Card>
        </div>

        <div className="space-y-6">
          <Card className="flex flex-col gap-4">
            <NeuralFeed />
          </Card>

          <Card className="bg-gradient-to-br from-primary to-accent text-white border-none p-8">
            <h4 className="text-xl font-display font-bold mb-2">Dominate Google</h4>
            <p className="text-white/80 text-sm mb-6 max-w-[200px]">Unlock automated scheduling for 24/7 SEO growth.</p>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary w-full shadow-lg">
              Upgrade to Infinity
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
