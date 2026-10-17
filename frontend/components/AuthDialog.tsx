```tsx
"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { useI18n } from "@/lib/i18n-context";
import { api } from "@/lib/api";

type Tab = "login" | "register" | null;

type AuthDialogProps = {
  activeTab: Tab;
  onClose: () => void;
};

type City = {
  id: number;
  name: string;
};

type LoginData = {
  emailOrPhone: string;
  password: string;
};

type RegisterData = {
  username: string;
  cityId: string;
  age: string;
  email: string;
  password: string;
};

const initialLoginData: LoginData = {
  emailOrPhone: "",
  password: "",
};

const initialRegisterData: RegisterData = {
  username: "",
  cityId: "",
  age: "",
  email: "",
  password: "",
};

export default function AuthDialog({
  activeTab,
  onClose,
}: AuthDialogProps) {
  const { t, lang } = useI18n();

  const loginText = {
    TR: {
      forgotPassword: "Şifremi Unuttum?",
      or: "veya",
      google: "Google ile Devam Et",
    },
    AZ: {
      forgotPassword: "Şifrəmi Unutdum?",
      or: "və ya",
      google: "Google ilə Davam Et",
    },
    EN: {
      forgotPassword: "Forgot Password?",
      or: "or",
      google: "Continue with Google",
    },
    RU: {
      forgotPassword: "Забыли пароль?",
      or: "или",
      google: "Продолжить с Google",
    },
    AR: {
      forgotPassword: "هل نسيت كلمة المرور؟",
      or: "أو",
      google: "المتابعة باستخدام Google",
    },
  }[lang] ?? {
    forgotPassword: "Şifremi Unuttum?",
    or: "veya",
    google: "Google ile Devam Et",
  };

  const [tab, setTab] = useState<Tab>(null);
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] =
    useState<LoginData>(initialLoginData);

  const [registerData, setRegisterData] =
    useState<RegisterData>(initialRegisterData);

  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  useEffect(() => {
    setTab(activeTab);

    if (activeTab === "register") {
      setRegisterStep(1);
    }
  }, [activeTab]);

  useEffect(() => {
    if (tab !== "register") return;

    let cancelled = false;

    const loadCities = async () => {
      try {
        setCitiesLoading(true);
        const data = await api.cities.list();

        if (!cancelled) {
          setCities(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Şehirler alınamadı:", error);

        if (!cancelled) {
          setCities([]);
          alert("Şehirler yüklenemedi. Lütfen tekrar deneyin.");
        }
      } finally {
        if (!cancelled) {
          setCitiesLoading(false);
        }
      }
    };

    loadCities();

    return () => {
      cancelled = true;
    };
  }, [tab]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !loginData.emailOrPhone.trim() ||
      !loginData.password
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);

    try {
      const res: any = await api.auth.login({
        emailOrPhone: loginData.emailOrPhone.trim(),
        password: loginData.password,
      });

      if (!res?.accessToken || !res?.refreshToken) {
        throw new Error("Giriş yanıtında token bilgisi bulunamadı.");
      }

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify(res.user || res.profile || res),
      );

      setLoginData({ ...initialLoginData });
      onClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      alert(err?.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (registerStep === 1) {
      const username = registerData.username.trim();
      const age = Number(registerData.age);
      const cityId = Number(registerData.cityId);

      if (username.length < 3) {
        alert("Kullanıcı adı en az 3 karakter olmalıdır.");
        return;
      }

      if (
        !registerData.cityId ||
        !Number.isInteger(cityId) ||
        cityId <= 0
      ) {
        alert("Lütfen şehir seçin.");
        return;
      }

      if (
        !registerData.age.trim() ||
        !Number.isInteger(age) ||
        age < 18 ||
        age > 120
      ) {
        alert("Kayıt için yaşınız 18 ile 120 arasında olmalıdır.");
        return;
      }

      if (!cities.some((city) => Number(city.id) === cityId)) {
        alert("Seçilen şehir bulunamadı. Lütfen tekrar seçin.");
        return;
      }

      // Bu aşamada backend'e istek gönderilmez ve hesap oluşturulmaz.
      setRegisterStep(2);
      return;
    }

    if (!registerData.email.trim()) {
      alert("Lütfen e-posta adresinizi girin.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        registerData.email.trim(),
      )
    ) {
      alert("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    if (registerData.password.length < 8) {
      alert("Şifreniz en az 8 karakter olmalıdır.");
      return;
    }

    if (!agreeTerms) {
      alert("Lütfen şartları kabul edin.");
      return;
    }

    const username = registerData.username.trim();
    const cityId = Number(registerData.cityId);
    const age = Number(registerData.age);

    setLoading(true);

    try {
      // Hesap yalnızca ikinci aşamada, bütün bilgilerle oluşturulur.
      // Backend'in zorunlu name alanına kullanıcı adı gönderilir.
      const res: any = await api.auth.register({
        name: username,
        username,
        email: registerData.email.trim().toLowerCase(),
        password: registerData.password,
        cityId,
        age,
      });

      console.log("REGISTER RESPONSE:", res);

      if (!res?.accessToken || !res?.refreshToken) {
        throw new Error(
          "Kayıt yanıtında giriş bilgileri bulunamadı. E-posta doğrulaması gerekiyorsa gelen mesajı kontrol edin.",
        );
      }

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      if (res.user || res.profile) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.user || res.profile),
        );
      }

      setRegisterData({ ...initialRegisterData });
      setRegisterStep(1);
      setAgreeTerms(false);
      setShowPassword(false);

      onClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);
      alert(err?.message || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    window.location.href =
      "https://egelove-backend.onrender.com/auth/login/google";
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTab(null);
      setRegisterStep(1);
    }
  };

  const fieldClass =
    "bg-[#310D0C]/65 border-[#F6BA48]/20 text-white placeholder:text-[#B5A093]/60 focus-visible:ring-[#F6BA48]/35";

  return (
    <Dialog
      open={tab !== null}
      onOpenChange={handleDialogChange}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-[#F6BA48]/20 bg-gradient-to-b from-[#512510] to-[#310D0C] text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        {tab === "login" && (
          <div>
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                {t.auth.login}
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleLogin}
              className="mt-4 space-y-4 text-gray-200"
            >
              <div>
                <Label className="text-white">
                  {t.auth.emailOrPhone}
                </Label>
                <Input
                  autoComplete="username"
                  placeholder={t.auth.emailOrPhone}
                  className={fieldClass}
                  value={loginData.emailOrPhone}
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      emailOrPhone: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label className="text-white">
                  {t.auth.password}
                </Label>
                <div className="relative">
                  <Input
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.auth.password}
                    className={`${fieldClass} pr-12`}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    aria-label={
                      showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.href = "/forgot-password";
                  }}
                  className="text-base text-[#F6BA48] hover:text-[#F8D290] hover:underline"
                >
                  {loginText.forgotPassword}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F6BA48] font-bold text-[#310D0C] hover:bg-[#EF912C]"
              >
                {loading ? "..." : t.auth.login}
              </Button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <span className="relative bg-[#512510] px-2 text-xs text-[#B5A093]/80">
                  {loginText.or}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSocialLogin}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white text-base font-medium text-black transition-colors hover:bg-gray-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.24 1 3.2 3.74 1.25 7.74l3.76 2.92C5.9 7.42 8.7 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.52z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.01 10.66c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.25 3.22C.45 4.82 0 6.61 0 8.5s.45 3.68 1.25 5.28l3.76-2.92z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-3.96 1.08-3.3 0-6.1-2.38-7.1-5.62L1.48 15.62C3.43 19.58 7.47 23 12 23z"
                  />
                </svg>
                {loginText.google}
              </button>

              <p className="text-center text-base text-white/60">
                {t.auth.noAccount}{" "}
                <button
                  type="button"
                  className="text-[#F6BA48] underline"
                  onClick={() => {
                    setRegisterStep(1);
                    setTab("register");
                  }}
                >
                  {t.auth.register}
                </button>
              </p>
            </form>
          </div>
        )}

        {tab === "register" && (
          <div>
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                {t.auth.register} — {registerStep}/2
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 flex gap-2" aria-label="Kayıt aşaması">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  registerStep >= 1 ? "bg-[#F6BA48]" : "bg-white/20"
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  registerStep >= 2 ? "bg-[#F6BA48]" : "bg-white/20"
                }`}
              />
            </div>

            <form
              onSubmit={handleRegister}
              className="mt-5 space-y-4 text-gray-200"
            >
              {registerStep === 1 && (
                <>
                  <p className="text-sm text-white/70">
                    Önce kullanıcı adını, yaşını ve yaşadığın şehri seç.
                  </p>

                  <div>
                    <Label className="text-white">
                      Kullanıcı Adı
                    </Label>
                    <Input
                      autoComplete="username"
                      minLength={3}
                      maxLength={30}
                      required
                      placeholder="Kullanıcı adın"
                      className={fieldClass}
                      value={registerData.username}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-white">Şehir</Label>
                    <Select
                      value={registerData.cityId}
                      onValueChange={(value) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          cityId: value,
                        }))
                      }
                      disabled={citiesLoading || cities.length === 0}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue
                          placeholder={
                            citiesLoading
                              ? "Şehirler yükleniyor..."
                              : "Şehir seç"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {cities.map((city) => (
                          <SelectItem
                            key={city.id}
                            value={String(city.id)}
                          >
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Yaş</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={18}
                      max={120}
                      step={1}
                      required
                      placeholder="Yaşın (18+)"
                      className={fieldClass}
                      value={registerData.age}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          age: e.target.value,
                        }))
                      }
                    />
                    <p className="mt-1 text-xs text-white/50">
                      Kayıt olmak için 18 yaşını doldurmuş olmalısın.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#F6BA48] font-bold text-[#310D0C] hover:bg-[#EF912C]"
                  >
                    Devam Et →
                  </Button>
                </>
              )}

              {registerStep === 2 && (
                <>
                  <p className="text-sm text-white/70">
                    Son adım: E-posta ve şifreni girerek kaydını tamamla.
                  </p>

                  <div className="rounded-md border border-[#F6BA48]/20 bg-black/10 p-3 text-sm">
                    <p>
                      <span className="text-white/60">Kullanıcı adı:</span>{" "}
                      {registerData.username}
                    </p>
                    <p>
                      <span className="text-white/60">Yaş:</span>{" "}
                      {registerData.age}
                    </p>
                    <p>
                      <span className="text-white/60">Şehir:</span>{" "}
                      {cities.find(
                        (city) =>
                          String(city.id) === registerData.cityId,
                      )?.name || "Seçilmedi"}
                    </p>
                  </div>

                  <div>
                    <Label className="text-white">E-posta</Label>
                    <Input
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="ornek@eposta.com"
                      className={fieldClass}
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-white">Şifre</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        placeholder="En az 8 karakter"
                        className={`${fieldClass} pr-12`}
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                        aria-label={
                          showPassword
                            ? "Şifreyi gizle"
                            : "Şifreyi göster"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Checkbox
                      id="register-terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) =>
                        setAgreeTerms(checked === true)
                      }
                    />
                    <Label
                      htmlFor="register-terms"
                      className="cursor-pointer leading-5 text-white/80"
                    >
                      {t.auth.terms}
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#F6BA48] font-bold text-[#310D0C] hover:bg-[#EF912C]"
                  >
                    {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                  </Button>

                  <Button
                    type="button"
                    disabled={loading}
                    onClick={() => setRegisterStep(1)}
                    variant="outline"
                    className="w-full border-[#F6BA48]/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    ← Geri
                  </Button>
                </>
              )}

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <span className="relative bg-[#512510] px-2 text-xs text-[#B5A093]/80">
                  {loginText.or}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSocialLogin}
                className="flex h-10 w-full items-center justify-center rounded-md bg-white font-medium text-black hover:bg-gray-100"
              >
                {loginText.google}
              </button>

              <p className="text-center text-base text-white/60">
                {t.auth.hasAccount}{" "}
                <button
                  type="button"
                  className="text-[#F6BA48] underline"
                  onClick={() => setTab("login")}
                >
                  {t.auth.login}
                </button>
              </p>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```
