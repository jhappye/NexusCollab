'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Bell, Palette, Shield, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'appearance', label: '外观', icon: Palette },
    { id: 'privacy', label: '隐私与安全', icon: Shield },
    { id: 'help', label: '帮助与反馈', icon: HelpCircle },
  ];

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">设置</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <Card className="p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Card className="p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              {activeSection === 'profile' && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">个人资料</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-indigo-600">A</span>
                      </div>
                      <Button variant="outline" size="sm">更换头像</Button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">昵称</label>
                      <input
                        type="text"
                        defaultValue="同学"
                        className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">邮箱</label>
                      <input
                        type="email"
                        defaultValue="student@example.com"
                        className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div className="pt-4">
                      <Button>保存修改</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">通知设置</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">任务提醒</p>
                        <p className="text-sm text-slate-500">收到新任务时通知</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">评价完成</p>
                        <p className="text-sm text-slate-500">AI 评价完成后通知</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">班级动态</p>
                        <p className="text-sm text-slate-500">班级成员变动时通知</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </label>
                  </div>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">外观设置</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">主题</label>
                      <div className="flex gap-3">
                        {['浅色', '深色', '跟随系统'].map((theme) => (
                          <button
                            key={theme}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">隐私与安全</h2>
                  <div className="space-y-4">
                    <Button variant="outline">修改密码</Button>
                    <div className="pt-4">
                      <h3 className="font-medium text-slate-700 dark:text-slate-200 mb-2">登录设备</h3>
                      <p className="text-sm text-slate-500">当前设备：MacBook Pro</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'help' && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">帮助与反馈</h2>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">常见问题</Button>
                    <Button variant="outline" className="w-full justify-start">意见反馈</Button>
                    <Button variant="outline" className="w-full justify-start">关于我们</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
