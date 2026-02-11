"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, UploadCloud, Calendar, Zap, Images } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-school-blue)] via-blue-600 to-[var(--color-school-green)] py-32 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            AI 校園相簿
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            智能相片管理系統，結合語意搜尋、人臉辨識與活動分類，讓學校活動回憶一觸即達。
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Button size="lg" asChild className="text-lg px-10 py-8 shadow-2xl hover:shadow-3xl">
              <a href="/photos">
                <Images className="mr-3 h-8 w-8" />
                立即瀏覽相簿
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              智能功能一覽
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              AI 驅動的相片管理，高效檢索與歸檔
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group-hover:bg-school-blue/5">
                <CardHeader>
                  <div className="w-20 h-20 bg-school-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-school-blue/20 transition-colors">
                    <Search className="h-10 w-10 text-school-blue group-hover:text-school-blue/80" />
                  </div>
                  <CardTitle className="text-2xl font-bold">語意搜尋</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    「操場跑步學生」即時找到相關相片
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group-hover:bg-school-green/5">
                <CardHeader>
                  <div className="w-20 h-20 bg-school-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-school-green/20 transition-colors">
                    <Users className="h-10 w-10 text-school-green" />
                  </div>
                  <CardTitle className="text-2xl font-bold">人臉辨識</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    輸入學生姓名，快速定位所有照片
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group-hover:bg-school-orange/5">
                <CardHeader>
                  <div className="w-20 h-20 bg-school-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-school-orange/20 transition-colors">
                    <UploadCloud className="h-10 w-10 text-school-orange" />
                  </div>
                  <CardTitle className="text-2xl font-bold">快速上傳</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    填寫活動資訊，一鍵上傳多張相片
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group-hover:bg-school-red/5">
                <CardHeader>
                  <div className="w-20 h-20 bg-school-red/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-school-red/20 transition-colors">
                    <Calendar className="h-10 w-10 text-school-red" />
                  </div>
                  <CardTitle className="text-2xl font-bold">活動分類</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    自動按年份、活動名稱整理相簿
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
