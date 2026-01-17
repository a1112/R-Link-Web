import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Activity,
  Server,
  Monitor,
  Globe,
  Share2,
  HardDrive,
  Settings,
  Bell,
  Search,
  Command,
  LayoutGrid,
  Folder,
  LogOut,
  Plus,
  Minus,
  Maximize,
  MoreHorizontal,
  Smartphone,
  Cloud,
  Wifi,
  Laptop,
  CheckCircle2,
  AlertCircle,
  FileText,
  Code,
  Archive,
  ArrowUp,
  Cpu,
  Terminal,
  X,
  Link,
  User,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  Shield,
  Zap,
  Check,
  ChevronRight,
  MousePointer2,
  Move,
  QrCode,
  MessageCircle,
  MessageSquare,
  Chrome,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  PanelLeftClose,
  PanelLeftOpen,
  Github,
  Twitter,
  Puzzle,
  ShieldCheck,
  Star,
  Download,
  ArrowLeft,
  Layout,
  PlusCircle,
  Edit,
  Save,
  Database
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner@2.0.3";

// --- Theme Configuration ---

const themeColors = {
  zinc: {
    950: "#09090b",
    900: "#18181b",
    800: "#27272a",
    700: "#3f3f46",
    600: "#52525b",
    500: "#71717a",
    400: "#a1a1aa",
    300: "#d4d4d8",
    200: "#e4e4e7",
    100: "#f4f4f5",
    50:  "#fafafa",
    white: "#ffffff",
    black: "#000000",
  },
  light: {
    950: "#ffffff", // Background
    900: "#f4f4f5", // Surface
    800: "#e4e4e7", // Border
    700: "#d4d4d8",
    600: "#a1a1aa", // Muted
    500: "#71717a",
    400: "#52525b", // Text
    300: "#3f3f46",
    200: "#18181b", // Main Text
    100: "#09090b", // Heading
    50:  "#000000",
    white: "#18181b", // Inverted white text -> dark
    black: "#ffffff", // Inverted black -> white
  }
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getThemeStyles = (themeName: string) => {
  const palette = themeColors[themeName as keyof typeof themeColors] || themeColors.zinc;
  const styles: Record<string, string> = {};
  
  // Base colors
  Object.entries(palette).forEach(([key, value]) => {
    styles[`--c-${key}`] = value;
  });

  // Special handling for light theme glassmorphism transparency
  const isLight = themeName === 'light';
  
  // Alphas
  styles['--c-950-85'] = hexToRgba(palette[950], isLight ? 0.60 : 0.85); // More transparent for light mode
  styles['--c-950-80'] = hexToRgba(palette[950], isLight ? 0.60 : 0.80);
  styles['--c-950-50'] = hexToRgba(palette[950], 0.50);
  styles['--c-900-50'] = hexToRgba(palette[900], 0.50);
  styles['--c-800-90'] = hexToRgba(palette[800], 0.90);
  styles['--c-800-50'] = hexToRgba(palette[800], 0.50);
  styles['--c-800-30'] = hexToRgba(palette[800], 0.30);
  styles['--c-500-20'] = hexToRgba(palette[500], 0.20);
  styles['--c-500-5'] = hexToRgba(palette[500], 0.05);

  // Additional var for modal backdrop
  styles['--c-modal-overlay'] = isLight ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.5)";

  return styles as React.CSSProperties;
};

// --- 模拟数据 ---

const trafficData = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 2}:00`,
  upload: Math.floor(Math.random() * 30) + 10,
  download: Math.floor(Math.random() * 60) + 20,
}));

const devices = [
  { id: 1, name: "工作站-Pro", os: "Windows 11 Pro", status: "online", ip: "10.0.0.4", type: "desktop", cpu: 12, ram: 45 },
  { id: 2, name: "MacBook-Air-M2", os: "macOS Sequoia", status: "online", ip: "10.0.0.7", type: "laptop", cpu: 8, ram: 60 },
  { id: 3, name: "Ubuntu-VPS-01", os: "Ubuntu 22.04 LTS", status: "online", ip: "192.168.1.5", type: "server", cpu: 5, ram: 20 },
  { id: 4, name: "NAS-存储服务", os: "TrueNAS Scale", status: "offline", ip: "10.0.0.100", type: "server", cpu: 0, ram: 0 },
];

const tunnels = [
  { id: 1, name: "博客预览", type: "HTTP", local: ":3000", remote: "blog.r-link.net", status: "active", latency: "12ms" },
  { id: 2, name: "SSH网关", type: "TCP", local: ":22", remote: "ssh.r-link.net:22022", status: "active", latency: "45ms" },
  { id: 3, name: "游戏服务器", type: "UDP", local: ":25565", remote: "play.r-link.net", status: "stopped", latency: "-" },
];

const files = [
  { id: 1, name: "网站备份_2023.zip", size: "2.4 GB", date: "10月 24", type: "archive" },
  { id: 2, name: "设计规范系统", size: "-", date: "10月 23", type: "folder" },
  { id: 3, name: "季度财务报告.pdf", size: "4.2 MB", date: "10月 22", type: "document" },
  { id: 4, name: "nginx.conf", size: "2 KB", date: "10月 21", type: "code" },
];

const domains = [
  { id: 1, name: "blog.r-link.net", target: "127.0.0.1:3000", ssl: "Active", status: "active", expiry: "2024-12-31" },
  { id: 2, name: "api.r-link.net", target: "192.168.1.5:8080", ssl: "Active", status: "active", expiry: "2024-11-15" },
  { id: 3, name: "dev.r-link.net", target: "10.0.0.7:5000", ssl: "Expired", status: "warning", expiry: "2023-10-01" },
];

// --- 拓扑数据 ---
const initialNodes = [
  { id: 'cloud', type: 'cloud', x: 400, y: 100, label: '互联网 / 云端', status: 'active' },
  { id: 'router', type: 'router', x: 400, y: 250, label: '核心网关', status: 'active' },
  { id: 'switch', type: 'switch', x: 400, y: 400, label: '交换机', status: 'active' },
  { id: 'pc1', type: 'desktop', x: 200, y: 550, label: '工作站 01', status: 'active' },
  { id: 'pc2', type: 'laptop', x: 350, y: 550, label: '移动办公 Mac', status: 'active' },
  { id: 'server1', type: 'server', x: 500, y: 550, label: '应用服务器', status: 'active' },
  { id: 'nas', type: 'server', x: 650, y: 550, label: 'NAS 存储', status: 'warning' },
];

const initialLinks = [
  { source: 'cloud', target: 'router', type: 'wan' },
  { source: 'router', target: 'switch', type: 'lan' },
  { source: 'switch', target: 'pc1', type: 'lan' },
  { source: 'switch', target: 'pc2', type: 'lan' },
  { source: 'switch', target: 'server1', type: 'lan' },
  { source: 'switch', target: 'nas', type: 'lan' },
];

// --- 组件 ---

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: { icon: any, label: string, active: boolean, onClick: () => void, collapsed: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
      active
        ? "bg-[var(--c-800)] text-[var(--c-100)]"
        : "text-[var(--c-500)] hover:bg-[var(--c-800-50)] hover:text-[var(--c-300)]"
    }`}
    title={collapsed ? label : undefined}
  >
    <Icon size={18} strokeWidth={2} className="flex-shrink-0" />
    {!collapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
  </button>
);

const StatCard = ({ title, value, sub, icon: Icon }) => (
  <div className="bg-[var(--c-900)] border border-[var(--c-800)] p-6 rounded-xl flex flex-col justify-between h-full hover:border-[var(--c-700)] transition-colors duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="p-2 bg-[var(--c-800)] rounded-lg text-[var(--c-400)]">
        <Icon size={20} />
      </div>
      {sub && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          sub.includes("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-[var(--c-800)] text-[var(--c-500)]"
        }`}>
          {sub}
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-[var(--c-100)] tracking-tight">{value}</div>
      <div className="text-sm text-[var(--c-500)] mt-1 font-medium">{title}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const isActive = status === 'active' || status === 'online';
  const label = status === 'active' ? '运行中' : status === 'online' ? '在线' : status === 'offline' ? '离线' : '已停止';
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
      isActive 
        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
        : "bg-[var(--c-500-5)] border-[var(--c-500-20)] text-[var(--c-500)]"
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-[var(--c-500)]"}`} />
      {label}
    </div>
  );
};

const FileIcon = ({ type }) => {
    switch (type) {
        case 'folder': return <Folder className="text-blue-400" size={20} />;
        case 'archive': return <Archive className="text-amber-400" size={20} />;
        case 'code': return <Code className="text-emerald-400" size={20} />;
        case 'document': return <FileText className="text-[var(--c-400)]" size={20} />;
        default: return <FileText className="text-[var(--c-400)]" size={20} />;
    }
}

// --- 认证组件 ---

const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'password' | 'qrcode'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);

  const handleLogin = () => {
    if (!agreementChecked) {
      toast.error("请先阅读并同意用户协议");
      return;
    }
    onLogin();
  };

  const handleGuestLogin = () => {
     if (!agreementChecked) {
      toast.error("请先阅读并同意用户协议");
      return;
    }
    toast.success("已开启游客体验模式");
    onLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--c-950)] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,var(--c-900),var(--c-950))]">
       {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[var(--c-950-50)] backdrop-blur-2xl border border-[var(--c-800-50)] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col"
      >
        {/* Header Section */}
        <div className="p-8 pb-4 text-center relative z-10">
          <div className="absolute top-4 right-4">
             <button 
                onClick={handleGuestLogin}
                className="text-xs font-medium text-[var(--c-500)] hover:text-[var(--c-200)] px-3 py-1.5 rounded-full border border-[var(--c-800)] hover:bg-[var(--c-800)] transition-colors flex items-center gap-1"
             >
                <User size={12} /> 游客模式
             </button>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--c-800)] text-[var(--c-100)] mb-4 shadow-lg border border-[var(--c-700)]">
             <Command size={24} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--c-100)] tracking-tight mb-1">
             {isLogin ? "欢迎回来" : "创建账户"}
          </h2>
          <p className="text-[var(--c-500)] text-sm">
             {isLogin ? "登录您的 R-Link 控制台" : "开始您的远程互联之旅"}
          </p>
        </div>

        {/* Content */}
        <motion.div layout className="p-8 pt-2 flex-1 relative z-10">
            {/* Tabs for Login Type */}
            {isLogin && (
              <div className="flex p-1 bg-[var(--c-900)] rounded-lg mb-6 border border-[var(--c-800)]">
                <button 
                  onClick={() => setAuthMethod('password')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                    authMethod === 'password' 
                    ? "bg-[var(--c-800)] text-[var(--c-100)] shadow-sm" 
                    : "text-[var(--c-500)] hover:text-[var(--c-300)]"
                  }`}
                >
                  <Lock size={14} /> 账号密码
                </button>
                <button 
                  onClick={() => setAuthMethod('qrcode')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                    authMethod === 'qrcode' 
                    ? "bg-[var(--c-800)] text-[var(--c-100)] shadow-sm" 
                    : "text-[var(--c-500)] hover:text-[var(--c-300)]"
                  }`}
                >
                  <QrCode size={14} /> 扫码登录
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {authMethod === 'password' ? (
                <motion.div 
                  key="password-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-[var(--c-400)] ml-1">电子邮箱</label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 text-[var(--c-600)] group-focus-within:text-[var(--c-300)] transition-colors" size={16} />
                        <input 
                          type="email" 
                          placeholder="name@example.com"
                          className="w-full bg-[var(--c-900-50)] border border-[var(--c-800)] text-[var(--c-200)] text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-[var(--c-600)] focus:ring-1 focus:ring-[var(--c-600)] transition-all placeholder:text-[var(--c-700)]"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between items-center ml-1">
                          <label className="text-xs font-medium text-[var(--c-400)]">密码</label>
                          {isLogin && <button className="text-xs text-[var(--c-500)] hover:text-[var(--c-300)] transition-colors">忘记密码?</button>}
                       </div>
                      <div className="relative group">
                         <Lock className="absolute left-3 top-2.5 text-[var(--c-600)] group-focus-within:text-[var(--c-300)] transition-colors" size={16} />
                         <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full bg-[var(--c-900-50)] border border-[var(--c-800)] text-[var(--c-200)] text-sm rounded-lg pl-10 pr-10 py-2.5 outline-none focus:border-[var(--c-600)] focus:ring-1 focus:ring-[var(--c-600)] transition-all placeholder:text-[var(--c-700)]"
                         />
                         <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-[var(--c-600)] hover:text-[var(--c-300)] focus:outline-none"
                         >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 py-1">
                        <div className="relative flex items-center h-4 mt-0.5">
                            <input 
                                id="agreement" 
                                type="checkbox"
                                checked={agreementChecked}
                                onChange={(e) => setAgreementChecked(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-600 bg-[var(--c-900)]"
                            />
                        </div>
                        <label htmlFor="agreement" className="text-xs text-[var(--c-500)] leading-tight select-none cursor-pointer">
                            我已阅读并同意 <span className="text-blue-400 hover:underline">用户协议</span> 与 <span className="text-blue-400 hover:underline">隐私政策</span>
                        </label>
                    </div>

                    <button 
                      onClick={handleLogin}
                      className="w-full bg-[var(--c-100)] hover:bg-[var(--c-white)] text-[var(--c-950)] font-semibold py-2.5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-white/5 mt-2 flex items-center justify-center gap-2"
                    >
                       {isLogin ? "登录" : "注册"} <ArrowRight size={16} />
                    </button>
                </motion.div>
              ) : (
                <motion.div 
                   key="qrcode-view"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="flex flex-col items-center justify-center py-4 space-y-4"
                >
                   <div className="w-48 h-48 bg-white rounded-xl p-2 shadow-inner flex items-center justify-center">
                       {/* Mock QR Code */}
                       <div className="w-full h-full border-4 border-[var(--c-900)] border-dashed opacity-10" />
                       <QrCode size={120} className="text-zinc-900 absolute" />
                   </div>
                   <p className="text-xs text-[var(--c-500)] text-center">
                      请使用 微信 或 QQ 扫描二维码<br/>安全登录 R-Link
                   </p>
                    <div className="flex items-center gap-2 mt-2">
                        <input 
                            id="agreement-qr" 
                            type="checkbox"
                            checked={agreementChecked}
                            onChange={(e) => setAgreementChecked(e.target.checked)}
                            className="w-3 h-3 rounded border-gray-600 text-blue-600 bg-[var(--c-900)]"
                        />
                        <label htmlFor="agreement-qr" className="text-xs text-[var(--c-500)] select-none cursor-pointer">
                            已阅读并同意用户协议
                        </label>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative my-6">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--c-800)]"></div>
               </div>
               <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[var(--c-950)] text-[var(--c-600)]">第三方登录</span>
               </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
               <button className="flex items-center justify-center py-2.5 border border-[var(--c-800)] rounded-lg hover:bg-[var(--c-800-50)] transition-colors group">
                  <MessageCircle size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
               </button>
               <button className="flex items-center justify-center py-2.5 border border-[var(--c-800)] rounded-lg hover:bg-[var(--c-800-50)] transition-colors group">
                   {/* QQ Icon Mockup with Lucide */}
                   <MessageSquare size={20} className="text-blue-500 group-hover:scale-110 transition-transform" fill="currentColor" fillOpacity={0.2} />
               </button>
               <button className="flex items-center justify-center py-2.5 border border-[var(--c-800)] rounded-lg hover:bg-[var(--c-800-50)] transition-colors group">
                  <Chrome size={20} className="text-[var(--c-200)] group-hover:scale-110 transition-transform" />
               </button>
               <button className="flex items-center justify-center py-2.5 border border-[var(--c-800)] rounded-lg hover:bg-[var(--c-800-50)] transition-colors group">
                  <Github size={20} className="text-[var(--c-200)] group-hover:scale-110 transition-transform" />
               </button>
               <button className="flex items-center justify-center py-2.5 border border-[var(--c-800)] rounded-lg hover:bg-[var(--c-800-50)] transition-colors group">
                  <Twitter size={20} className="text-sky-400 group-hover:scale-110 transition-transform" />
               </button>
            </div>
        </motion.div>

        {/* Footer */}
        <div className="p-4 bg-[var(--c-900-50)] border-t border-[var(--c-800-50)] text-center">
           <button 
             onClick={() => setIsLogin(!isLogin)}
             className="text-xs text-[var(--c-400)] hover:text-[var(--c-200)] transition-colors"
           >
              {isLogin ? (
                 <>还没有账号? <span className="text-blue-400 font-medium">立即注册</span></>
              ) : (
                 <>已有账号? <span className="text-blue-400 font-medium">直接登录</span></>
              )}
           </button>
        </div>
      </motion.div>
    </div>
  );
}

import { NodeDetailModal } from "./components/NodeDetailModal";
import { PluginDetailModal } from "./components/PluginDetailModal";

import { TopologyView } from "./components/TopologyView";

const DashboardView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    {/* 统计卡片 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="在线设备" value="3" sub="总计 4 台" icon={Monitor} />
      <StatCard title="网络流量" value="1.2 GB" sub="+12% 较上周" icon={Activity} />
      <StatCard title="活跃隧道" value="2" sub="运行稳定" icon={Globe} />
      <StatCard title="存储已用" value="450 GB" sub="45%" icon={HardDrive} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 图表区域 */}
      <div className="lg:col-span-2 bg-[var(--c-900)] border border-[var(--c-800)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[var(--c-100)] font-semibold text-lg">网络活动监控</h3>
            <p className="text-[var(--c-500)] text-sm mt-1">入站与出站流量实时概览</p>
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1.5 text-xs font-medium text-[var(--c-400)] hover:text-[var(--c-100)] bg-[var(--c-800-50)] hover:bg-[var(--c-800)] rounded-md transition-colors">24小时</button>
             <button className="px-3 py-1.5 text-xs font-medium text-[var(--c-100)] bg-[var(--c-800)] rounded-md">7天</button>
             <button className="px-3 py-1.5 text-xs font-medium text-[var(--c-400)] hover:text-[var(--c-100)] bg-[var(--c-800-50)] hover:bg-[var(--c-800)] rounded-md transition-colors">30天</button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-800)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--c-600)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--c-600)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--c-900)", borderColor: "var(--c-800)", color: "var(--c-100)", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                itemStyle={{ color: "var(--c-200)" }}
                cursor={{ stroke: "var(--c-700)", strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="download" stroke="#3b82f6" strokeWidth={2} fill="url(#colorDown)" name="下载 (Mbps)" />
              <Area type="monotone" dataKey="upload" stroke="#10b981" strokeWidth={2} fill="url(#colorUp)" name="上传 (Mbps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 系统状态 */}
      <div className="bg-[var(--c-900)] border border-[var(--c-800)] rounded-xl p-6 flex flex-col h-full">
        <h3 className="text-[var(--c-100)] font-semibold text-lg mb-1">系统健康状态</h3>
        <p className="text-[var(--c-500)] text-sm mb-6">核心组件实时性能指标</p>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--c-400)] font-medium">CPU 使用率</span>
              <span className="text-[var(--c-200)]">12%</span>
            </div>
            <div className="h-2 w-full bg-[var(--c-800)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--c-200)] w-[12%] rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--c-400)] font-medium">内存 使用率</span>
              <span className="text-[var(--c-200)]">45%</span>
            </div>
            <div className="h-2 w-full bg-[var(--c-800)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--c-200)] w-[45%] rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--c-400)] font-medium">存储空间</span>
              <span className="text-[var(--c-200)]">62%</span>
            </div>
            <div className="h-2 w-full bg-[var(--c-800)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--c-200)] w-[62%] rounded-full" />
            </div>
          </div>

          <div className="pt-6 mt-auto border-t border-[var(--c-800)]">
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                     <CheckCircle2 size={20} />
                 </div>
                 <div>
                     <div className="text-sm font-medium text-[var(--c-200)]">所有系统运行正常</div>
                     <div className="text-xs text-[var(--c-500)]">上次检查: 2分钟前</div>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ... (Other Views: RemoteView, TopologyView, FRPView, StorageView remain largely the same, I will include them to ensure file integrity)

const RemoteView = () => {
  const handleConnect = (name, type) => {
    toast(`正在连接到 ${name}...`, {
      description: `正在建立安全 ${type} 会话连接`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-xl font-bold text-[var(--c-100)] tracking-tight">远程设备</h2>
           <p className="text-[var(--c-500)] text-sm">管理远程连接与终端节点</p>
        </div>
        <button className="bg-[var(--c-100)] hover:bg-[var(--c-white)] text-[var(--c-900)] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> 添加设备
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="group bg-[var(--c-900)] border border-[var(--c-800)] rounded-xl p-5 hover:border-[var(--c-700)] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-[var(--c-800)] rounded-lg flex items-center justify-center text-[var(--c-400)]">
                    {device.type === 'desktop' ? <Monitor size={20} /> : device.type === 'laptop' ? <Monitor size={20} /> : <Server size={20} />}
                 </div>
                 <div>
                    <h3 className="text-sm font-semibold text-[var(--c-100)]">{device.name}</h3>
                    <p className="text-xs text-[var(--c-500)]">{device.os}</p>
                 </div>
              </div>
              <StatusBadge status={device.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
                <div className="bg-[var(--c-950-50)] p-2 rounded border border-[var(--c-800-50)]">
                    <span className="text-[var(--c-500)] block mb-1">IP 地址</span>
                    <span className="font-mono text-[var(--c-300)]">{device.ip}</span>
                </div>
                <div className="bg-[var(--c-950-50)] p-2 rounded border border-[var(--c-800-50)]">
                    <span className="text-[var(--c-500)] block mb-1">资源占用</span>
                    <span className="font-mono text-[var(--c-300)]">{device.cpu}% CPU</span>
                </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleConnect(device.name, 'Desktop')}
                disabled={device.status === 'offline'}
                className="flex-1 bg-[var(--c-800)] hover:bg-[var(--c-700)] text-[var(--c-200)] disabled:opacity-50 disabled:cursor-not-allowed py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--c-700)] hover:border-[var(--c-600)]"
              >
                远程桌面
              </button>
              <button
                onClick={() => handleConnect(device.name, 'SSH')}
                disabled={device.status === 'offline'}
                className="px-4 bg-[var(--c-900)] hover:bg-[var(--c-800)] text-[var(--c-400)] hover:text-[var(--c-200)] border border-[var(--c-800)] hover:border-[var(--c-700)] rounded-lg transition-colors"
              >
                <Terminal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OldTopologyView = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [draggingNode, setDraggingNode] = useState(null);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [hoveredNode, setHoveredNode] = useState(null);
    const [detailNode, setDetailNode] = useState(null);
    const containerRef = useRef(null);

    const handleWheel = (e) => {
        // Prevent default scroll behavior
        e.preventDefault();
        
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Standardize delta
        const delta = -e.deltaY;
        const factor = delta > 0 ? 1.1 : 0.9;
        let newScale = scale * factor;
        
        // Limits
        newScale = Math.max(0.1, Math.min(5, newScale));

        // Zoom towards mouse pointer
        const newOffsetX = mouseX - (mouseX - offset.x) * (newScale / scale);
        const newOffsetY = mouseY - (mouseY - offset.y) * (newScale / scale);

        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) {
            setIsDragging(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e) => {
        if (draggingNode) {
            const dx = (e.clientX - lastMousePos.x) / scale;
            const dy = (e.clientY - lastMousePos.y) / scale;
            
            setNodes(nodes.map(n => 
                n.id === draggingNode ? { ...n, x: n.x + dx, y: n.y + dy } : n
            ));
            setLastMousePos({ x: e.clientX, y: e.clientY });
        } else if (isDragging) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            setOffset({ x: offset.x + dx, y: offset.y + dy });
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggingNode(null);
    };

    const handleZoomIn = () => {
        setScale(Math.min(3, scale * 1.2));
    };
    const handleZoomOut = () => {
        setScale(Math.max(0.5, scale / 1.2));
    };
    const handleFitView = () => {
        setScale(1);
        setOffset({ x: 0, y: 0 });
    };

    const getNodeCenter = (node) => ({
        x: node.x + 32,
        y: node.y + 32
    });

    const getNodeIcon = (type) => {
        switch(type) {
            case 'cloud': return <Cloud size={24} className="text-blue-400" />;
            case 'router': return <Wifi size={24} className="text-violet-400" />;
            case 'switch': return <Server size={24} className="text-indigo-400" />;
            case 'desktop': return <Monitor size={24} className="text-[var(--c-200)]" />;
            case 'laptop': return <Laptop size={24} className="text-[var(--c-200)]" />;
            case 'server': return <HardDrive size={24} className="text-amber-400" />;
            default: return <Server size={24} />;
        }
    };

    // Calculate screen position for hover tooltip
    const getHoverPosition = () => {
        if (!hoveredNode) return {};
        // Node position in canvas space
        const nodeX = hoveredNode.x;
        const nodeY = hoveredNode.y;
        
        // Convert to screen/container space
        // formula: screen = canvas * scale + offset
        // We add some offset to position tooltip to the right of the node
        const left = (nodeX * scale) + offset.x + (80 * scale); 
        const top = (nodeY * scale) + offset.y;
        
        return { left, top };
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col bg-[var(--c-900)] border border-[var(--c-800)] rounded-xl overflow-hidden relative select-none">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-[var(--c-800-90)] backdrop-blur border border-[var(--c-700)] p-1 rounded-lg shadow-xl">
                <button onClick={handleZoomIn} className="p-2 text-[var(--c-300)] hover:text-[var(--c-white)] hover:bg-[var(--c-700)] rounded-md transition-colors"><Plus size={20} /></button>
                <button onClick={handleZoomOut} className="p-2 text-[var(--c-300)] hover:text-[var(--c-white)] hover:bg-[var(--c-700)] rounded-md transition-colors"><Minus size={20} /></button>
                <button onClick={handleFitView} className="p-2 text-[var(--c-300)] hover:text-[var(--c-white)] hover:bg-[var(--c-700)] rounded-md transition-colors"><Maximize size={20} /></button>
            </div>
            
            <div className="absolute top-4 left-4 z-10 bg-[var(--c-800-90)] backdrop-blur border border-[var(--c-700)] px-4 py-2 rounded-lg shadow-xl pointer-events-none">
                <h3 className="text-sm font-bold text-[var(--c-100)]">网络拓扑图</h3>
                <p className="text-xs text-[var(--c-500)]">拖拽平移，滚轮缩放视图</p>
            </div>

            {/* Hover Tooltip - Floating independent of canvas scale */}
            <AnimatePresence>
                {hoveredNode && !isDragging && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-30 w-56 pointer-events-none"
                        style={getHoverPosition()}
                    >
                         <div className="bg-[var(--c-950-85)] backdrop-blur-md border border-[var(--c-800)] rounded-xl shadow-xl p-4 text-left">
                             <div className="flex items-center justify-between mb-2">
                                 <span className="text-xs font-bold text-[var(--c-100)]">{hoveredNode.label}</span>
                                 <span className={`w-2 h-2 rounded-full ${
                                    hoveredNode.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'
                                 }`} />
                             </div>
                             <div className="space-y-1.5">
                                 <div className="flex justify-between text-[10px]">
                                     <span className="text-[var(--c-500)]">IP</span>
                                     <span className="text-[var(--c-300)] font-mono">10.0.0.{hoveredNode.id.length * 12 + 5}</span>
                                 </div>
                                 <div className="flex justify-between text-[10px]">
                                     <span className="text-[var(--c-500)]">Type</span>
                                     <span className="text-[var(--c-300)] capitalize">{hoveredNode.type}</span>
                                 </div>
                                 <div className="pt-1 mt-1 border-t border-[var(--c-800-50)] text-[10px] text-[var(--c-500)] text-center">
                                    双击查看详情
                                 </div>
                             </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Detail Modal */}
            <AnimatePresence>
                {detailNode && (
                    <NodeDetailModal node={detailNode} onClose={() => setDetailNode(null)} />
                )}
            </AnimatePresence>

            {/* Canvas */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-hidden cursor-move bg-[var(--c-950)] relative"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                    handleMouseUp();
                    setHoveredNode(null);
                }}
            >
                <div 
                    className="absolute inset-0 origin-top-left will-change-transform"
                    style={{ 
                        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`
                    }}
                >
                    {/* Grid Background Pattern */}
                    <div className="absolute -inset-[4000px] opacity-10 pointer-events-none" 
                        style={{
                            backgroundImage: 'radial-gradient(circle, var(--c-500) 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}
                    ></div>

                    {/* Connections Layer (SVG) */}
                    <svg className="absolute top-0 left-0 w-[4000px] h-[4000px] pointer-events-none overflow-visible">
                         {initialLinks.map((link, i) => {
                             const sourceNode = nodes.find(n => n.id === link.source);
                             const targetNode = nodes.find(n => n.id === link.target);
                             if (!sourceNode || !targetNode) return null;
                             
                             const start = getNodeCenter(sourceNode);
                             const end = getNodeCenter(targetNode);
                             
                             return (
                                 <g key={i}>
                                     <line 
                                         x1={start.x} y1={start.y} 
                                         x2={end.x} y2={end.y} 
                                         stroke="var(--c-700)" 
                                         strokeWidth="2"
                                         strokeDasharray={link.type === 'wan' ? "5,5" : "0"}
                                     />
                                 </g>
                             )
                         })}
                    </svg>

                    {/* Nodes Layer (Divs) */}
                    {nodes.map(node => (
                        <div
                            key={node.id}
                            onMouseDown={(e) => {
                                e.stopPropagation(); // Prevent canvas pan
                                setDraggingNode(node.id);
                                setLastMousePos({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseEnter={() => setHoveredNode(node)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                setDetailNode(node);
                                setHoveredNode(null); // Hide tooltip when modal opens
                            }}
                            className={`absolute flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing group w-24
                                ${node.status === 'active' ? 'border-[var(--c-800)] bg-[var(--c-900)]' : 'border-amber-900/30 bg-amber-950/10'}
                                hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]
                            `}
                            style={{ 
                                transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                                touchAction: 'none'
                            }}
                        >
                             <div className={`p-3 rounded-lg ${
                                 node.status === 'active' ? 'bg-[var(--c-800)]' : 'bg-amber-500/10 text-amber-500'
                             }`}>
                                 {getNodeIcon(node.type)}
                             </div>
                             <div className="text-center pointer-events-none">
                                 <div className="text-[10px] font-bold text-[var(--c-300)] leading-tight">{node.label}</div>
                                 <div className="text-[8px] text-[var(--c-500)] font-mono mt-1">{node.status}</div>
                             </div>
                             
                             {/* Status Indicator */}
                             <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--c-950)] ${
                                 node.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                             }`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FRPView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-[var(--c-100)] tracking-tight">隧道列表</h2>
                <p className="text-[var(--c-500)] text-sm">FRP 反向代理配置与管理</p>
            </div>
            <button className="bg-[var(--c-100)] hover:bg-[var(--c-white)] text-[var(--c-900)] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus size={16} /> 新建隧道
            </button>
        </div>

        <div className="bg-[var(--c-900)] border border-[var(--c-800)] rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-[var(--c-800)] text-[var(--c-500)]">
                        <th className="p-4 font-medium w-12">#</th>
                        <th className="p-4 font-medium">名称</th>
                        <th className="p-4 font-medium">类型</th>
                        <th className="p-4 font-medium">本地端点</th>
                        <th className="p-4 font-medium">远程地址</th>
                        <th className="p-4 font-medium">状态</th>
                        <th className="p-4 font-medium text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--c-800-50)]">
                    {tunnels.map((tunnel) => (
                        <tr key={tunnel.id} className="group hover:bg-[var(--c-800-30)] transition-colors">
                            <td className="p-4 text-[var(--c-600)] font-mono">{tunnel.id}</td>
                            <td className="p-4 font-medium text-[var(--c-200)]">{tunnel.name}</td>
                            <td className="p-4">
                                <span className="px-2 py-1 rounded bg-[var(--c-800)] text-[var(--c-400)] text-xs font-mono">{tunnel.type}</span>
                            </td>
                            <td className="p-4 text-[var(--c-400)] font-mono text-xs">{tunnel.local}</td>
                            <td className="p-4 text-[var(--c-400)] font-mono text-xs text-blue-400 hover:underline cursor-pointer">{tunnel.remote}</td>
                            <td className="p-4">
                                <StatusBadge status={tunnel.status} />
                            </td>
                            <td className="p-4 text-right">
                                <button className="p-2 text-[var(--c-500)] hover:text-[var(--c-200)] hover:bg-[var(--c-800)] rounded-md transition-colors">
                                    <MoreHorizontal size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)

const DomainView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-[var(--c-100)] tracking-tight">域名管理</h2>
                <p className="text-[var(--c-500)] text-sm">绑定自定义域名与 SSL 证书管理</p>
            </div>
            <button className="bg-[var(--c-100)] hover:bg-[var(--c-white)] text-[var(--c-900)] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus size={16} /> 添加域名
            </button>
        </div>

        <div className="bg-[var(--c-900)] border border-[var(--c-800)] rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-[var(--c-800)] text-[var(--c-500)]">
                        <th className="p-4 font-medium w-12">#</th>
                        <th className="p-4 font-medium">域名</th>
                        <th className="p-4 font-medium">指向目标</th>
                        <th className="p-4 font-medium">SSL 证书</th>
                        <th className="p-4 font-medium">过期时间</th>
                        <th className="p-4 font-medium">状态</th>
                        <th className="p-4 font-medium text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--c-800-50)]">
                    {domains.map((domain) => (
                        <tr key={domain.id} className="group hover:bg-[var(--c-800-30)] transition-colors">
                            <td className="p-4 text-[var(--c-600)] font-mono">{domain.id}</td>
                            <td className="p-4 font-medium text-[var(--c-200)] flex items-center gap-2">
                                <Globe size={14} className="text-[var(--c-500)]" />
                                {domain.name}
                            </td>
                            <td className="p-4 text-[var(--c-400)] font-mono text-xs">{domain.target}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                    domain.ssl === 'Active' 
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                    {domain.ssl}
                                </span>
                            </td>
                            <td className="p-4 text-[var(--c-500)] text-xs">{domain.expiry}</td>
                            <td className="p-4">
                                <StatusBadge status={domain.status} />
                            </td>
                            <td className="p-4 text-right">
                                <button className="p-2 text-[var(--c-500)] hover:text-[var(--c-200)] hover:bg-[var(--c-800)] rounded-md transition-colors">
                                    <MoreHorizontal size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)

const useBackNavigation = (onBack: () => void, enable: boolean = true) => {
    useEffect(() => {
        if (!enable) return;

        const handlePopState = (e: PopStateEvent) => {
            e.preventDefault();
            window.history.pushState(null, "", window.location.href);
            onBack();
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener('popstate', handlePopState);

        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === 3) { 
                e.preventDefault();
                // onBack() is handled by popstate usually, but if popstate fails:
                // onBack(); 
            }
        };
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [enable, onBack]);
};

const StorageView = () => {
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    
    const getFilesForPath = (path: string[]) => {
        if (path.length === 0) {
            return [
                { id: 1, name: "项目文档", size: "-", date: "10月 24", type: "folder" },
                { id: 2, name: "设计资源", size: "-", date: "10月 23", type: "folder" },
                { id: 3, name: "根目录文件.pdf", size: "4.2 MB", date: "10月 22", type: "document" },
            ];
        } else if (path[path.length - 1] === "项目文档") {
             return [
                { id: 11, name: "需求说明书.docx", size: "1.2 MB", date: "10月 25", type: "document" },
                { id: 12, name: "API接口文档.md", size: "45 KB", date: "10月 25", type: "code" },
            ];
        } else {
             return [
                { id: 21, name: "Logo.svg", size: "12 KB", date: "10月 23", type: "image" },
                { id: 22, name: "Banner.png", size: "2.4 MB", date: "10月 23", type: "image" },
            ];
        }
    };

    const currentFiles = getFilesForPath(currentPath);

    const handleNavigate = (folderName: string) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleBack = () => {
        if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
            toast.info("已返回上一级");
        } else {
            toast.warning("已经是根目录");
        }
    };

    useBackNavigation(handleBack, true);

    return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-[var(--c-100)] tracking-tight">文件管理</h2>
                <p className="text-[var(--c-500)] text-sm">WebDAV 云存储文件浏览器</p>
            </div>
             <div className="flex gap-2">
                <button className="bg-[var(--c-800)] hover:bg-[var(--c-700)] text-[var(--c-200)] px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <ArrowUp size={16} /> 上传
                </button>
                <button className="bg-[var(--c-100)] hover:bg-[var(--c-white)] text-[var(--c-900)] px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Plus size={16} /> 新建文件夹
                </button>
             </div>
        </div>

        <div className="bg-[var(--c-900)] border border-[var(--c-800)] rounded-xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-[var(--c-800)] flex items-center gap-2 text-sm">
                <button 
                    onClick={handleBack}
                    disabled={currentPath.length === 0}
                    className="p-1.5 rounded-md hover:bg-[var(--c-800)] text-[var(--c-400)] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors mr-2"
                >
                    <ArrowUp className="-rotate-90" size={16} />
                </button>
                <span 
                    className={`p-1.5 rounded-md hover:bg-[var(--c-800)] text-[var(--c-400)] cursor-pointer transition-colors ${currentPath.length === 0 ? 'text-[var(--c-100)]' : ''}`}
                    onClick={() => setCurrentPath([])}
                >
                    <HardDrive size={16} />
                </span>
                <span className="text-[var(--c-600)]">/</span>
                <span 
                    className={`font-medium cursor-pointer transition-colors ${currentPath.length === 0 ? 'text-[var(--c-200)]' : 'text-[var(--c-500)] hover:text-[var(--c-200)]'}`}
                    onClick={() => setCurrentPath([])}
                >
                    根目录
                </span>
                {currentPath.map((folder, index) => (
                    <React.Fragment key={folder}>
                        <span className="text-[var(--c-600)]">/</span>
                        <span 
                            className={`font-medium cursor-pointer transition-colors ${index === currentPath.length - 1 ? 'text-[var(--c-200)]' : 'text-[var(--c-500)] hover:text-[var(--c-200)]'}`}
                            onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                        >
                            {folder}
                        </span>
                    </React.Fragment>
                ))}
            </div>
            
            <div className="flex-1 overflow-auto">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--c-800)] text-[var(--c-500)]">
                            <th className="p-4 font-medium w-10"></th>
                            <th className="p-4 font-medium">文件名</th>
                            <th className="p-4 font-medium">大小</th>
                            <th className="p-4 font-medium">修改时间</th>
                            <th className="p-4 font-medium text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--c-800-50)]">
                        {currentFiles.map((file) => (
                             <tr 
                                key={file.id} 
                                onClick={() => file.type === 'folder' && handleNavigate(file.name)}
                                className="group hover:bg-[var(--c-800-30)] transition-colors cursor-pointer"
                             >
                                 <td className="p-4 pl-6">
                                    <FileIcon type={file.type} />
                                 </td>
                                 <td className="p-4 font-medium text-[var(--c-200)] group-hover:text-blue-400 transition-colors">{file.name}</td>
                                 <td className="p-4 text-[var(--c-500)] font-mono text-xs">{file.size}</td>
                                 <td className="p-4 text-[var(--c-500)] text-xs">{file.date}</td>
                                 <td className="p-4 text-right pr-6">
                                     <button className="opacity-0 group-hover:opacity-100 p-2 text-[var(--c-400)] hover:text-[var(--c-100)] transition-all">
                                         <MoreHorizontal size={16} />
                                     </button>
                                 </td>
                             </tr>
                        ))}
                    </tbody>
                 </table>
            </div>

            <div className="p-4 border-t border-[var(--c-800)] bg-[var(--c-900-50)] flex justify-between items-center text-xs text-[var(--c-500)]">
                <span>已选择 {currentFiles.length} 项</span>
                <span>已用 2.4 GB / 总共 1 TB</span>
            </div>
        </div>
    </div>
    );
};

const PluginsView = () => {
  const [activeTab, setActiveTab] = useState("market");
  const [selectedPlugin, setSelectedPlugin] = useState(null);

  const marketPlugins = [
    { 
        id: "p1", 
        name: "高级流量分析", 
        description: "提供更详细的流量监控图表，支持应用层协议识别与统计。", 
        author: "R-Link Team", 
        version: "2.1.0", 
        downloads: "12k", 
        rating: 4.8,
        status: "installed",
        verified: true,
        icon: Activity,
        features: ["应用层协议识别", "历史流量回溯", "自定义报表导出", "异常流量告警"]
    },
    { 
        id: "p2", 
        name: "Web终端增强", 
        description: "为内置SSH终端添加主题支持、多窗口分屏与Zmodem文件传输功能。", 
        author: "Community", 
        version: "1.0.5", 
        downloads: "8.5k", 
        rating: 4.5,
        status: "update_available",
        verified: false,
        icon: Terminal,
        features: ["Zmodem文件传输", "多窗口分屏", "Solarized主题", "快捷命令片段"]
    },
    { 
        id: "p3", 
        name: "Docker容器管理", 
        description: "直接在设备列表中管理远程主机的Docker容器，支持启动、停止与日志查看。", 
        author: "Docker Inc.", 
        version: "3.2.1", 
        downloads: "45k", 
        rating: 4.9,
        status: "not_installed",
        verified: true,
        icon: Server,
        features: ["容器生命周期管理", "实时日志流", "镜像管理", "Compose支持"]
    },
    { 
        id: "p4", 
        name: "网络测速工具", 
        description: "集成iperf3与Speedtest，一键测试节点间的带宽与延迟。", 
        author: "NetworkTools", 
        version: "0.9.8", 
        downloads: "3k", 
        rating: 4.2,
        status: "not_installed",
        verified: false,
        icon: Zap,
        features: ["iperf3集成", "Speedtest节点测速", "历史记录对比", "图形化报告"]
    },
    { 
        id: "p5", 
        name: "自动备份助手", 
        description: "定期自动备份关键配置文件到云端存储，防止数据丢失。", 
        author: "R-Link Team", 
        version: "1.5.0", 
        downloads: "15k", 
        rating: 4.7,
        status: "installed",
        verified: true,
        icon: Archive,
        features: ["定时自动备份", "多版本保留", "加密存储", "一键恢复"]
    },
  ];

  const myPlugins = marketPlugins.filter(p => p.status !== 'not_installed');

  const displayPlugins = activeTab === 'market' ? marketPlugins : myPlugins;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-[var(--c-100)] tracking-tight">插件中心</h2>
                <p className="text-[var(--c-500)] text-sm">扩展 R-Link 的功能与特性</p>
            </div>
            <div className="flex gap-2 bg-[var(--c-900)] p-1 rounded-lg border border-[var(--c-800)]">
                <button 
                    onClick={() => setActiveTab("market")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        activeTab === "market" 
                        ? "bg-[var(--c-800)] text-[var(--c-100)] shadow-sm" 
                        : "text-[var(--c-500)] hover:text-[var(--c-300)]"
                    }`}
                >
                    插件市场
                </button>
                <button 
                    onClick={() => setActiveTab("mine")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        activeTab === "mine" 
                        ? "bg-[var(--c-800)] text-[var(--c-100)] shadow-sm" 
                        : "text-[var(--c-500)] hover:text-[var(--c-300)]"
                    }`}
                >
                    我的插件
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPlugins.map((plugin) => (
                <div 
                    key={plugin.id}
                    onClick={() => setSelectedPlugin(plugin)}
                    className="group bg-[var(--c-900)] border border-[var(--c-800)] hover:border-[var(--c-700)] hover:bg-[var(--c-900-50)] rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[var(--c-800)] flex items-center justify-center text-[var(--c-200)] group-hover:scale-110 transition-transform duration-300">
                            <plugin.icon size={24} />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             {plugin.status === 'installed' && (
                                 <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">已安装</span>
                             )}
                             {plugin.status === 'update_available' && (
                                 <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">可更新</span>
                             )}
                        </div>
                    </div>
                    
                    <h3 className="text-[var(--c-100)] font-bold mb-1 flex items-center gap-1.5">
                        {plugin.name}
                        {plugin.verified && <ShieldCheck size={14} className="text-blue-500" />}
                    </h3>
                    <p className="text-xs text-[var(--c-500)] line-clamp-2 h-8 mb-4 leading-relaxed">
                        {plugin.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-[10px] text-[var(--c-600)] border-t border-[var(--c-800-50)] pt-3">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><Star size={10} className="fill-[var(--c-600)]" /> {plugin.rating}</span>
                            <span className="flex items-center gap-1"><Download size={10} /> {plugin.downloads}</span>
                        </div>
                        <span>v{plugin.version}</span>
                    </div>
                </div>
            ))}
            
            {/* Add New Placeholder */}
            {activeTab === 'market' && (
                <div className="border border-dashed border-[var(--c-800)] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--c-900-50)] transition-colors group text-[var(--c-500)] hover:text-[var(--c-300)] min-h-[180px]">
                    <div className="w-12 h-12 rounded-full bg-[var(--c-800-50)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <div className="text-sm font-medium">提交插件</div>
                    <div className="text-xs mt-1 opacity-60">成为开发者贡献代码</div>
                </div>
            )}
        </div>

        <AnimatePresence>
            {selectedPlugin && (
                <PluginDetailModal 
                    plugin={selectedPlugin} 
                    onClose={() => setSelectedPlugin(null)}
                    onInstall={() => {
                        toast.success(`已开始安装 ${selectedPlugin.name}`);
                        setSelectedPlugin(null);
                    }}
                    onUninstall={() => {
                         toast.success(`已卸载 ${selectedPlugin.name}`);
                         setSelectedPlugin(null);
                    }}
                />
            )}
        </AnimatePresence>
    </div>
  );
};

const UserMenu = ({ onClose, onOpenSettings, onLogout }: { onClose: () => void, onOpenSettings: () => void, onLogout: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    transition={{ duration: 0.1 }}
    className="absolute top-12 right-4 w-64 bg-[var(--c-950-80)] backdrop-blur-xl border border-[var(--c-800)] rounded-xl shadow-2xl z-50 overflow-hidden"
  >
    <div className="p-4 border-b border-[var(--c-800-50)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--c-800)] border border-[var(--c-700)] flex items-center justify-center text-sm font-medium text-[var(--c-300)]">
          RL
        </div>
        <div>
          <div className="text-sm font-medium text-[var(--c-100)]">Admin User</div>
          <div className="text-xs text-[var(--c-500)]">admin@r-link.net</div>
        </div>
      </div>
    </div>
    
    <div className="p-2 space-y-1">
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--c-400)] hover:text-[var(--c-100)] hover:bg-[var(--c-800-50)] rounded-lg transition-colors group">
        <User size={16} className="text-[var(--c-500)] group-hover:text-[var(--c-100)]" />
        个人资料
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--c-400)] hover:text-[var(--c-100)] hover:bg-[var(--c-800-50)] rounded-lg transition-colors group">
        <CreditCard size={16} className="text-[var(--c-500)] group-hover:text-[var(--c-100)]" />
        订阅管理
      </button>
      <button 
        onClick={() => {
            onClose();
            onOpenSettings();
        }}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--c-400)] hover:text-[var(--c-100)] hover:bg-[var(--c-800-50)] rounded-lg transition-colors group"
      >
        <Settings size={16} className="text-[var(--c-500)] group-hover:text-[var(--c-100)]" />
        系统设置
      </button>
    </div>

    <div className="p-2 border-t border-[var(--c-800-50)]">
      <button 
        onClick={() => {
            onClose();
            onLogout();
        }}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
      >
        <LogOut size={16} />
        退出登录
      </button>
    </div>
  </motion.div>
);

const SettingsModal = ({ onClose, currentTheme, onThemeChange }: { onClose: () => void, currentTheme: string, onThemeChange: (t: string) => void }) => {
  const [activeTab, setActiveTab] = useState("display");
  
  const tabs = [
    { id: "general", label: "通用设置", icon: Settings },
    { id: "account", label: "账户安全", icon: Shield },
    { id: "network", label: "网络配置", icon: Globe },
    { id: "display", label: "界面显示", icon: Monitor },
  ];

  const themes = [
    { id: "zinc", name: "极致灰", primary: "bg-zinc-500", bg: "bg-zinc-900" },
    { id: "light", name: "纯净白", primary: "bg-zinc-200", bg: "bg-zinc-100" },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-sm" 
      style={{ backgroundColor: 'var(--c-modal-overlay)' }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl h-[520px] bg-[var(--c-950-85)] backdrop-blur-2xl border border-[var(--c-800)] rounded-2xl shadow-2xl overflow-hidden flex"
      >
        {/* Sidebar */}
        <div className="w-56 border-r border-[var(--c-800-50)] p-4 bg-[var(--c-900-50)]">
          <div className="mb-6 px-2">
            <h2 className="text-lg font-bold text-[var(--c-100)]">设置</h2>
          </div>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id 
                    ? "bg-[var(--c-800)] text-[var(--c-100)] shadow-sm" 
                    : "text-[var(--c-400)] hover:text-[var(--c-200)] hover:bg-[var(--c-800-50)]"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-14 border-b border-[var(--c-800-50)] flex items-center justify-between px-8 shrink-0">
            <h3 className="font-semibold text-[var(--c-200)]">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 text-[var(--c-500)] hover:text-[var(--c-200)] hover:bg-[var(--c-800)] rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--c-800)] scrollbar-track-transparent">
            {activeTab === "general" && (
              <div className="space-y-6 max-w-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-[var(--c-200)]">开机自启动</div>
                      <div className="text-xs text-[var(--c-500)]">系统启动时自动运行 R-Link</div>
                    </div>
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="w-full h-px bg-[var(--c-800-50)]" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-[var(--c-200)]">托盘图标</div>
                      <div className="text-xs text-[var(--c-500)]">关闭窗口时最小化到系统托盘</div>
                    </div>
                     <div className="w-10 h-5 bg-[var(--c-700)] rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-[var(--c-400)] rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6 max-w-xl">
                 <div className="bg-[var(--c-900)] border border-[var(--c-800)] rounded-xl divide-y divide-[var(--c-800)]">
                      <div className="p-4 flex items-center justify-between">
                          <div>
                              <div className="text-[var(--c-200)] font-medium text-sm">双重认证 (2FA)</div>
                              <div className="text-xs text-[var(--c-500)] mt-1">为您的管理账户添加额外的安全保护</div>
                          </div>
                          <div className="w-10 h-5 bg-[var(--c-800)] rounded-full relative cursor-pointer">
                              <div className="absolute left-1 top-1 w-3 h-3 bg-[var(--c-500)] rounded-full"></div>
                          </div>
                      </div>
                       <div className="p-4 flex items-center justify-between">
                          <div>
                              <div className="text-[var(--c-200)] font-medium text-sm">API 访问密钥</div>
                              <div className="text-xs text-[var(--c-500)] mt-1">管理用��自动化脚本的个人访问令牌</div>
                          </div>
                          <button className="text-xs font-medium bg-[var(--c-800)] text-[var(--c-300)] px-3 py-1.5 rounded-lg hover:bg-[var(--c-700)] transition-colors">管理密钥</button>
                      </div>
                  </div>
              </div>
            )}

            {activeTab === "display" && (
              <div className="space-y-6">
                 <div>
                    <h4 className="text-sm font-medium text-[var(--c-200)] mb-4">主题外观</h4>
                    <div className="grid grid-cols-2 gap-4">
                       {themes.map(theme => (
                          <div 
                             key={theme.id}
                             onClick={() => onThemeChange(theme.id)}
                             className={`relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${currentTheme === theme.id ? 'border-[var(--c-200)] ring-1 ring-[var(--c-200)]/50' : 'border-[var(--c-800)] hover:border-[var(--c-700)]'}`}
                          >
                             <div className={`h-20 ${theme.bg} p-3 flex flex-col gap-2`}>
                                <div className="flex gap-2">
                                   <div className={`w-2 h-2 rounded-full ${theme.primary}`} />
                                   <div className="w-12 h-2 rounded-full bg-white/10" />
                                </div>
                                <div className="space-y-1 mt-auto opacity-50">
                                   <div className="w-full h-1 rounded-full bg-white/10" />
                                   <div className="w-2/3 h-1 rounded-full bg-white/10" />
                                </div>
                             </div>
                             <div className="p-3 bg-[var(--c-900-50)] flex items-center justify-between border-t border-[var(--c-800-50)]">
                                <span className={`text-xs font-medium ${currentTheme === theme.id ? 'text-[var(--c-100)]' : 'text-[var(--c-500)]'}`}>{theme.name}</span>
                                {currentTheme === theme.id && <CheckCircle2 size={14} className="text-[var(--c-100)]" />}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="space-y-4 pt-4 border-t border-[var(--c-800-50)]">
                   <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-[var(--c-200)]">界面缩放</div>
                        <div className="text-xs text-[var(--c-500)]">调整应用程序的显示比例</div>
                      </div>
                      <select className="bg-[var(--c-900)] border border-[var(--c-800)] text-[var(--c-300)] text-xs rounded-lg px-2 py-1 outline-none focus:border-[var(--c-700)]">
                         <option>100%</option>
                         <option>110%</option>
                         <option>125%</option>
                      </select>
                   </div>
                 </div>
              </div>
            )}

             {activeTab !== "general" && activeTab !== "display" && activeTab !== "account" && (
                <div className="flex flex-col items-center justify-center h-full text-[var(--c-500)] space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--c-800-50)] flex items-center justify-center">
                        <Settings size={32} className="opacity-20" />
                    </div>
                    <p className="text-sm">该模块配置项正在开发中...</p>
                </div>
             )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const App = () => {
  const [route, setRoute] = useState<'auth' | 'app' | 'guest'>('app');
  const [activeTab, setActiveTab] = useState("network");
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [theme, setTheme] = useState("zinc");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const themeStyles = useMemo(() => getThemeStyles(theme), [theme]);

  // Guest mode specific UI elements or restrictions could be handled here
  const isGuest = route === 'guest';
  const isAuthenticated = route !== 'auth';

  return (
    <div 
        className="flex h-screen bg-[var(--c-950)] text-[var(--c-200)] font-sans selection:bg-[var(--c-800)] selection:text-[var(--c-white)] overflow-hidden"
        style={themeStyles}
    >
      <Toaster position="bottom-right" theme="dark" toastOptions={{
         style: { background: 'var(--c-900)', border: '1px solid var(--c-800)', color: 'var(--c-100)' }
      }}/>
      
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
           <motion.div 
             key="auth"
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
             transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
             className="fixed inset-0 z-50"
           >
              <AuthScreen 
                onLogin={() => setRoute('app')} 
                onGuestLogin={() => setRoute('guest')}
              />
           </motion.div>
        ) : (
          <motion.div 
             key="app-shell"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.5 }}
             className="flex w-full h-full"
          >
              {/* Sidebar */}
              <motion.div 
                initial={false}
                animate={{ width: isSidebarCollapsed ? 80 : 256 }}
                className="bg-[var(--c-950)] border-r border-[var(--c-800)] flex flex-col flex-shrink-0 z-20 relative"
              >
                {isGuest && (
                   <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full z-30" />
                )}
                
                <div className={`p-6 flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
                  <div className={`flex items-center gap-3 ${isSidebarCollapsed ? '' : 'flex-1 overflow-hidden'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isGuest ? 'bg-amber-500 text-black' : 'bg-[var(--c-100)] text-[var(--c-950)]'}`}>
                      {isGuest ? <User size={18} strokeWidth={3} /> : <Command size={18} strokeWidth={3} />}
                    </div>
                    {!isSidebarCollapsed && (
                      <h1 className="text-lg font-bold text-[var(--c-100)] tracking-tight whitespace-nowrap">
                        {isGuest ? 'Guest Mode' : 'R-Link'}
                      </h1>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-transparent hover:border-[var(--c-800)] hover:bg-[var(--c-900)] text-[var(--c-500)] hover:text-[var(--c-200)] transition-all duration-200 active:scale-95 shadow-sm hover:shadow"
                  >
                    {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                  </button>
                </div>

                <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
                  {!isSidebarCollapsed && <div className="px-3 mb-2 mt-2 text-[10px] font-semibold text-[var(--c-600)] uppercase tracking-wider whitespace-nowrap">概览</div>}
                  <SidebarItem icon={LayoutGrid} label="仪表盘" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} collapsed={isSidebarCollapsed} />
                  
                  {!isGuest && (
                    <>
                      <SidebarItem icon={Activity} label="数据分析" active={false} onClick={() => {}} collapsed={isSidebarCollapsed} />
                      {!isSidebarCollapsed && <div className="px-3 mb-2 mt-6 text-[10px] font-semibold text-[var(--c-600)] uppercase tracking-wider whitespace-nowrap">网络管理</div>}
                      <SidebarItem icon={Share2} label="网络拓扑图" active={activeTab === "network"} onClick={() => setActiveTab("network")} collapsed={isSidebarCollapsed} />
                      <SidebarItem icon={Monitor} label="设备列表" active={activeTab === "remote"} onClick={() => setActiveTab("remote")} collapsed={isSidebarCollapsed} />
                      <SidebarItem icon={Globe} label="内网穿透" active={activeTab === "frp"} onClick={() => setActiveTab("frp")} collapsed={isSidebarCollapsed} />
                      <SidebarItem icon={Link} label="域名管理" active={activeTab === "domains"} onClick={() => setActiveTab("domains")} collapsed={isSidebarCollapsed} />
                      
                      {!isSidebarCollapsed && <div className="px-3 mb-2 mt-6 text-[10px] font-semibold text-[var(--c-600)] uppercase tracking-wider whitespace-nowrap">数据存储</div>}
                      <SidebarItem icon={Folder} label="文件管理" active={activeTab === "storage"} onClick={() => setActiveTab("storage")} collapsed={isSidebarCollapsed} />

                      {!isSidebarCollapsed && <div className="px-3 mb-2 mt-6 text-[10px] font-semibold text-[var(--c-600)] uppercase tracking-wider whitespace-nowrap">扩展应用</div>}
                      <SidebarItem icon={Puzzle} label="插件中心" active={activeTab === "plugins"} onClick={() => setActiveTab("plugins")} collapsed={isSidebarCollapsed} />
                    </>
                  )}
                  
                  {isGuest && (
                      <div className="mt-4 px-3 py-4 bg-[var(--c-900)] rounded-xl border border-[var(--c-800)] text-center">
                          <div className="mb-2 flex justify-center text-amber-500"><Shield size={24} /></div>
                          {!isSidebarCollapsed && (
                              <>
                                <h4 className="text-xs font-bold text-[var(--c-200)] mb-1">受限访问</h4>
                                <p className="text-[10px] text-[var(--c-500)] leading-tight">游客模式下部分功能不可用，请登录以解锁全部功能。</p>
                              </>
                          )}
                      </div>
                  )}

                </nav>

                <div className="p-4 border-t border-[var(--c-800)] mt-auto overflow-hidden">
                  <div className={`px-2 flex flex-col gap-2 ${isSidebarCollapsed ? 'items-center' : ''}`}>
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                        {!isSidebarCollapsed && <span className="text-xs font-semibold text-[var(--c-400)] whitespace-nowrap">R-Link Client</span>}
                        {!isSidebarCollapsed && <span className="text-[10px] font-mono text-[var(--c-600)]">v1.2.0</span>}
                        {isSidebarCollapsed && <span className="text-[10px] font-mono text-[var(--c-600)]">v1.2</span>}
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="text-[10px] text-[var(--c-600)] leading-relaxed whitespace-nowrap">
                            © 2026 R-Link Network.<br/>
                            All rights reserved.
                        </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--c-950)] relative">
                
                {/* Header */}
                <header className="h-12 border-b border-[var(--c-800)] bg-[var(--c-950)] flex items-center justify-between px-4 shrink-0 select-none" style={{ WebkitAppRegion: 'drag' }}>
                  {/* Left: Page Title */}
                  <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
                     <h2 className="text-sm font-semibold text-[var(--c-200)]">
                        {activeTab === 'dashboard' && '仪表盘'}
                        {activeTab === 'network' && '网络拓扑管理'}
                        {activeTab === 'remote' && '设备列表'}
                        {activeTab === 'frp' && '内网穿透'}
                        {activeTab === 'domains' && '域名管理'}
                        {activeTab === 'storage' && '文件管理'}
                        {activeTab === 'plugins' && '插件中心'}
                     </h2>
                  </div>

                  {/* Right: Search & Actions */}
                  <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' }}>
                    <div className="flex items-center gap-2 text-[var(--c-400)] w-48 bg-[var(--c-900-50)] border border-[var(--c-800)] rounded-md px-2.5 py-1 transition-colors hover:border-[var(--c-700)] hover:bg-[var(--c-900)] focus-within:border-[var(--c-600)] focus-within:bg-[var(--c-900)]">
                      <Search size={13} className="text-[var(--c-500)] shrink-0" />
                      <input 
                        type="text" 
                        placeholder="搜索..." 
                        className="bg-transparent border-none text-xs text-[var(--c-200)] w-full outline-none placeholder:text-[var(--c-600)] h-5"
                      />
                    </div>

                    <div className="h-4 w-px bg-[var(--c-800)]" />
                    <button className="relative p-2 text-[var(--c-500)] hover:text-[var(--c-200)] hover:bg-[var(--c-800-50)] rounded-lg transition-colors">
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--c-950)]"></span>
                    </button>
                    
                    <div className="h-6 w-px bg-[var(--c-800)] mx-1" />

                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-[var(--c-800-50)] transition-colors group"
                    >
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-[var(--c-200)] group-hover:text-[var(--c-100)]">{isGuest ? 'Guest' : 'Admin User'}</div>
                        <div className="text-xs text-[var(--c-500)]">{isGuest ? '只读权限' : 'admin@r-link.net'}</div>
                      </div>
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-medium transition-colors ${isGuest ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-[var(--c-800)] border-[var(--c-700)] text-[var(--c-300)]'}`}>
                        {isGuest ? <User size={16} /> : 'RL'}
                      </div>
                    </button>
                  </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden p-6 relative">
                  <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                      <motion.div key="dashboard" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                        <DashboardView />
                      </motion.div>
                    )}
                    {activeTab === 'remote' && (
                      <motion.div key="remote" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                        <RemoteView />
                      </motion.div>
                    )}
                    {activeTab === 'network' && (
                      <motion.div key="network" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                          <TopologyView />
                      </motion.div>
                    )}
                    {activeTab === 'frp' && (
                      <motion.div key="frp" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                          <FRPView />
                      </motion.div>
                    )}
                    {activeTab === 'domains' && (
                      <motion.div key="domains" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                          <DomainView />
                      </motion.div>
                    )}
                    {activeTab === 'storage' && (
                      <motion.div key="storage" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                          <StorageView />
                      </motion.div>
                    )}
                    {activeTab === 'plugins' && (
                      <motion.div key="plugins" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                          <PluginsView />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showUserMenu && (
          <>
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-40 bg-transparent" 
               onClick={() => setShowUserMenu(false)} 
             />
             <UserMenu 
                onClose={() => setShowUserMenu(false)} 
                onOpenSettings={() => setShowSettings(true)}
                onLogout={() => setRoute('auth')}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
           <SettingsModal onClose={() => setShowSettings(false)} currentTheme={theme} onThemeChange={setTheme} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
