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

type District = {
  id: number;
  name: string;
  cityId: number;
};

type LoginData = {
  emailOrPhone: string;
  password: string;
};

type RegisterData = {
  name: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  cityId: string;
  districtId: string;
};

const initialLoginData: LoginData = {
  emailOrPhone: "",
  password: "",
};

const initialRegisterData: RegisterData = {
  name: "",
  username: "",
  email: "",
  password: "",
  birthDate: "",
  gender: "",
  cityId: "",
  districtId: "",
};

export default function AuthDialog({
  activeTab,
  onClose,
}: AuthDialogProps) {
  const { t } = useI18n();

  const [tab, setTab] = useState<Tab>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] =
    useState<LoginData>(initialLoginData);

  const [registerData, setRegisterData] =
    useState<RegisterData>(initialRegisterData);

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  /*
   * Açılan sekmeyi takip et.
   */
  useEffect(() => {
    setTab(activeTab);
  }, [activeTab]);

  /*
   * Şehir listesini backend'den getir.
   *
   * Artık AuthDialog içerisinde sabit 81 il / ilçe listesi yok.
   */
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

  /*
   * Şehir değiştiğinde o şehre ait ilçeleri backend'den getir.
   */
  useEffect(() => {
    if (!registerData.cityId) {
      setDistricts([]);
      return;
    }

    let cancelled = false;

    const loadDistricts = async () => {
      try {
        setDistrictsLoading(true);

        const cityId = Number(registerData.cityId);

        if (!Number.isInteger(cityId) || cityId <= 0) {
          setDistricts([]);

          if (!cancelled) {
            setRegisterData((prev) => ({
              ...prev,
              districtId: "",
            }));
          }

          return;
        }

        const data = await api.cities.districts(cityId);

        if (!cancelled) {
          setDistricts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("İlçeler alınamadı:", error);

        if (!cancelled) {
          setDistricts([]);
          setRegisterData((prev) => ({
            ...prev,
            districtId: "",
          }));

          alert("İlçeler yüklenemedi. Lütfen tekrar deneyin.");
        }
      } finally {
        if (!cancelled) {
          setDistrictsLoading(false);
        }
      }
    };

    loadDistricts();

    return () => {
      cancelled = true;
    };
  }, [registerData.cityId]);

  /*
   * LOGIN
   */
  const handleLogin = async (e: React.FormEvent) => {
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

      console.log("🔐 LOGIN RESPONSE:", res);

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

  /*
   * REGISTER
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Lütfen şartları kabul edin.");
      return;
    }

    if (
      !registerData.name.trim() ||
      !registerData.username.trim() ||
      !registerData.email.trim() ||
      !registerData.password
    ) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    /*
     * Doğum tarihi ve cinsiyet artık sessizce varsayılan değer
     * almıyor. Kullanıcı gerçekten seçim yapmış olmalı.
     */
    if (!registerData.birthDate) {
      alert("Lütfen doğum tarihinizi seçin.");
      return;
    }

    if (!registerData.gender) {
      alert("Lütfen cinsiyet seçin.");
      return;
    }

    if (!registerData.cityId) {
      alert("Lütfen şehir seçin.");
      return;
    }

    if (!registerData.districtId) {
      alert("Lütfen ilçe seçin.");
      return;
    }

    const cityId = Number(registerData.cityId);
    const districtId = Number(registerData.districtId);

    if (!Number.isInteger(cityId) || cityId <= 0) {
      alert("Geçerli bir şehir seçin.");
      return;
    }

    if (!Number.isInteger(districtId) || districtId <= 0) {
      alert("Geçerli bir ilçe seçin.");
      return;
    }

    /*
     * Seçilen şehir ve ilçenin gerçekten mevcut olduğunu
     * frontend tarafında da kontrol ediyoruz.
     */
    const selectedCity = cities.find(
      (city) => Number(city.id) === cityId,
    );

    if (!selectedCity) {
      alert("Seçilen şehir bulunamadı. Lütfen tekrar seçin.");
      return;
    }

    const selectedDistrict = districts.find(
      (district) => Number(district.id) === districtId,
    );

    if (!selectedDistrict) {
      alert("Seçilen ilçe bulunamadı. Lütfen tekrar seçin.");
      return;
    }

    /*
     * Güvenlik kontrolü:
     * İlçe gerçekten seçilen şehre mi ait?
     */
    if (Number(selectedDistrict.cityId) !== cityId) {
      alert("Seçilen ilçe, seçilen şehre ait değil.");
      return;
    }

    console.log("📝 KAYIT VERİSİ:", {
      name: registerData.name.trim(),
      username: registerData.username.trim(),
      email: registerData.email.trim(),
      birthDate: registerData.birthDate,
      gender: registerData.gender,
      cityId,
      cityName: selectedCity.name,
      districtId,
      districtName: selectedDistrict.name,
    });

    setLoading(true);

    try {
      const res: any = await api.auth.register({
        name: registerData.name.trim(),
        username: registerData.username.trim(),
        email: registerData.email.trim(),
        password: registerData.password,

        /*
         * Formda seçilen gerçek değerler gönderiliyor.
         */
        birthDate: registerData.birthDate,
        gender: registerData.gender,
        cityId,
        districtId,

        /*
         * Mevcut backend sözleşmesini koruyoruz.
         */
        turnstileToken: "demo-token",
      });

      console.log("✅ REGISTER RESPONSE:", res);

      if (!res?.accessToken || !res?.refreshToken) {
        throw new Error(
          "Kayıt başarılı görünüyor ancak giriş token bilgileri alınamadı.",
        );
      }

      /*
       * Kayıt sonrası tokenları kaydet.
       */
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      /*
       * Backend kullanıcı bilgisini döndürüyorsa sakla.
       */
      if (res.user || res.profile) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.user || res.profile),
        );
      }

      /*
       * Formu temizle.
       */
      setRegisterData({ ...initialRegisterData });
      setAgreeTerms(false);

      onClose();

      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);

      alert(err?.message || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * GOOGLE LOGIN
   */
  const handleSocialLogin = () => {
    window.location.href =
      "https://egelove-backend.onrender.com/auth/login/google";
  };

  /*
   * Dialog kapanırken formu zorla değiştirmiyoruz.
   */
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTab(null);
    }
  };

  return (
    <Dialog
      open={tab !== null}
      onOpenChange={handleDialogChange}
    >
      <DialogContent className="max-w-md bg-pink-900 text-white border-white/10">
        {/* =========================
            LOGIN
        ========================== */}
        {tab === "login" && (
          <div>
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                {t.auth.login}
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleLogin}
              className="space-y-4 mt-4 text-gray-200"
            >
              <div>
                <Label className="text-white">
                  {t.auth.emailOrPhone}
                </Label>

                <Input
                  placeholder={t.auth.emailOrPhone}
                  className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
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
                    type={showPassword ? "text" : "password"}
                    placeholder={t.auth.password}
                    className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40 pr-12"
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
                      showPassword
                        ? "Şifreyi gizle"
                        : "Şifreyi göster"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-1 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.href =
                      "/forgot-password";
                  }}
                  className="text-base text-pink-300 hover:text-pink-200 hover:underline transition-colors"
                >
                  Şifremi Unuttum?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold"
              >
                {loading ? "..." : t.auth.login}
              </Button>

              <div className="relative my-4 flex items-center justify-center w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>

                <span className="relative bg-pink-900 px-2 text-xs text-white/60">
                  veya
                </span>
              </div>

              <button
                type="button"
                onClick={handleSocialLogin}
                className="w-full h-10 flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-medium rounded-md text-base transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                >
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

                Google ile Devam Et
              </button>

              <p className="text-center text-base text-white/60">
                {t.auth.noAccount}{" "}
                <button
                  type="button"
                  className="text-pink-300 underline"
                  onClick={() => setTab("register")}
                >
                  {t.auth.register}
                </button>
              </p>
            </form>
          </div>
        )}

        {/* =========================
            REGISTER
        ========================== */}
        {tab === "register" && (
          <div>
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                {t.auth.register}
              </DialogTitle>

              <Button
                type="button"
                onClick={handleSocialLogin}
                className="w-full mt-4 bg-white text-gray-900 hover:bg-gray-100 font-bold"
              >
                {t.auth.google}
              </Button>
            </DialogHeader>

            <form
              onSubmit={handleRegister}
              className="space-y-4 mt-4 text-gray-200"
            >
              {/* İSİM + KULLANICI ADI */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">
                    {t.auth.name}
                  </Label>

                  <Input
                    placeholder={t.auth.name}
                    className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="text-white">
                    Kullanıcı Adı
                  </Label>

                  <Input
                    placeholder="Kullanıcı Adı"
                    className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* E-POSTA */}
              <Input
                type="email"
                placeholder={t.auth.email}
                className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />

              {/* ŞİFRE */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.auth.password}
                  className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40 pr-12"
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
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* DOĞUM TARİHİ + CİNSİYET */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">
                    Doğum Tarihi
                  </Label>

                  <Input
                    type="date"
                    className="bg-pink-950/50 border-white/10 text-white"
                    value={registerData.birthDate}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        birthDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="text-white">
                    {t.auth.gender}
                  </Label>

                  <Select
                    value={registerData.gender}
                    onValueChange={(value) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        gender: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                      <SelectValue
                        placeholder={t.auth.gender}
                      />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="FEMALE">
                        {t.auth.female}
                      </SelectItem>

                      <SelectItem value="MALE">
                        {t.auth.male}
                      </SelectItem>

                      <SelectItem value="OTHER">
                        {t.auth.other}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ŞEHİR + İLÇE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">
                    {t.auth.selectCity}
                  </Label>

                  <Select
                    value={registerData.cityId}
                    onValueChange={(value) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        cityId: value,
                        districtId: "",
                      }))
                    }
                    disabled={
                      citiesLoading || cities.length === 0
                    }
                  >
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                      <SelectValue
                        placeholder={
                          citiesLoading
                            ? "Şehirler yükleniyor..."
                            : t.auth.selectCity
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
                  <Label className="text-white">
                    {t.auth.selectDistrict}
                  </Label>

                  <Select
                    value={registerData.districtId}
                    onValueChange={(value) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        districtId: value,
                      }))
                    }
                    disabled={
                      !registerData.cityId ||
                      districtsLoading ||
                      districts.length === 0
                    }
                  >
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                      <SelectValue
                        placeholder={
                          !registerData.cityId
                            ? "Önce şehir seçin"
                            : districtsLoading
                              ? "İlçeler yükleniyor..."
                              : t.auth.selectDistrict
                        }
                      />
                    </SelectTrigger>

                    <SelectContent className="max-h-72">
                      {districts.map((district) => (
                        <SelectItem
                          key={district.id}
                          value={String(district.id)}
                        >
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ŞARTLAR */}
              <div className="flex items-center gap-2 text-base">
                <Checkbox
                  checked={agreeTerms}
                  onCheckedChange={(checked) =>
                    setAgreeTerms(!!checked)
                  }
                />

                <span>{t.auth.terms}</span>
              </div>

              {/* KAYIT */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold"
              >
                {loading ? "..." : t.auth.register}
              </Button>

              <p className="text-center text-base text-white/60">
                {t.auth.hasAccount}{" "}
                <button
                  type="button"
                  className="text-pink-300 underline"
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