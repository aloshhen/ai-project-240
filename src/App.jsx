import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// SafeIcon Component - Full Lucide library access
const SafeIcon = ({ name, size = 24, className, color }) => {
  const [Icon, setIcon] = useState(null);
  useEffect(() => {
    import('lucide-react').then((icons) => {
      const pascalCase = name
        .split('-');
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      const FoundIcon = icons[pascalCase] || icons.HelpCircle
      setIcon(() => FoundIcon)
    })
  }, [name])
  
  if (!Icon) return <div style={{ width: size, height: size }} className={className} />;
  
  return <Icon size={size} className={className} color={color} />;
}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true);
    setIsError(false);
    const formData = new FormData(e.target);
    formData.append('access_key', accessKey);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json()
      
      if (data.success) {
        setIsSuccess(true);
        e.target.reset()
      } else {
        setIsError(true);
        setErrorMessage(data.message || 'Что-то пошло не так');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('Ошибка сети. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const resetForm = () => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage('');
  }
  
  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm };
}

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    // Set target to end of current month
    const now = new Date()
    const target = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    
    const calculateTimeLeft = () => {
      const difference = target - new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [])
  
  const TimeBox = ({ value, label }) => (
    <div className="bg-white rounded-xl p-3 min-w-[70px] text-center shadow-lg">
      <div className="text-2xl md:text-3xl font-black text-orange-600">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  )
  
  return (;
    <div className="flex gap-3 justify-center md:justify-start">
      <TimeBox value={timeLeft.days} label="дней" />
      <TimeBox value={timeLeft.hours} label="часов" />
      <TimeBox value={timeLeft.minutes} label="минут" />
      <TimeBox value={timeLeft.seconds} label="секунд" />
    </div>
  )
}

// Scroll Animation Hook
const useScrollAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return { ref, isInView };
}

// Puppy Card Component
const PuppyCard = ({ name, gender, age, price, image, badge }) => {
  const { ref, isInView } = useScrollAnimation()
  
  return (;
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {badge}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 flex items-center gap-1">
          <SafeIcon name="heart" size={14} className="text-red-500" />
          {gender === 'male' ? 'Мальчик' : 'Девочка'}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-500 mb-4 flex items-center gap-2">
          <SafeIcon name="calendar" size={16} />
          {age}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-black text-orange-600">{price} ₽</span>
          {badge && (
            <span className="text-sm text-gray-400 line-through">
              {Math.round(price * 1.2).toLocaleString()} ₽
            </span>
          )}
        </div>
        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2">
          <SafeIcon name="phone" size={18} />
          Забронировать
        </button>
      </div>
    </motion.div>
  )
}

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (;
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <SafeIcon name="chevron-down" size={24} className="text-orange-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (;
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SafeIcon name="x" size={24} className="text-gray-500" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Contact Form Component
const ContactForm = ({ accessKey, compact = false }) => {
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  
  if (isSuccess) {
    return (;
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon name="check-circle" size={40} className="text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Заявка отправлена!</h3>
        <p className="text-gray-600 mb-6">
          Спасибо за обращение! Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          onClick={resetForm}
          className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
        >
          Отправить еще одну заявку
        </button>
      </motion.div>
    )
  }
  
  return (;
    <form onSubmit={(e) => handleSubmit(e, accessKey)} className="space-y-4">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Ваше имя"
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
        />
      </div>
      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Ваш телефон"
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
        />
      </div>
      {!compact && (
        <div>
          <textarea
            name="message"
            placeholder="Ваше сообщение (необязательно)"
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
          ></textarea>
        </div>
      )}
      {isError && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Отправка...
          </>
        ) : (
          <>
            <SafeIcon name="send" size={18} />
            {compact ? 'Заказать звонок' : 'Отправить заявку'}
          </>
        )}
      </button>
    </form>
  )
}

// Main App Component
function App() {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key
  
  const puppies = [
    {
      name: 'Айс',
      gender: 'male',
      age: '2 месяца',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
      badge: 'Скидка 20%'
    },
    {
      name: 'Луна',
      gender: 'female',
      age: '2.5 месяца',
      price: 52000,
      image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&q=80',
      badge: null
    },
    {
      name: 'Снежок',
      gender: 'male',
      age: '3 месяца',
      price: 48000,
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80',
      badge: 'Лучший выбор'
    }
  ]
  
  const features = [
    {
      icon: 'shield-check',
      title: 'Гарантия здоровья',
      description: 'Все щенки проходят ветеринарный осмотр и имеют международный ветпаспорт'
    },
    {
      icon: 'file-text',
      title: 'Документы RKF/FCI',
      description: 'Полный пакет документов на чистокровность породы'
    },
    {
      icon: 'truck',
      title: 'Доставка',
      description: 'Безопасная доставка в любой город России и СНГ'
    },
    {
      icon: 'heart-handshake',
      title: 'Поддержка 24/7',
      description: 'Консультации по уходу и воспитанию питомца'
    }
  ]
  
  const faqs = [
    {
      question: 'Какой характер у японского шпица?',
      answer: 'Японский шпиц - это живая, общительная и ласковая порода. Они очень привязаны к семье, отлично ладят с детьми и другими животными. Шпицы умны, легко обучаемы и не склонны к агрессии.'
    },
    {
      question: 'Как ухаживать за шерстью?',
      answer: 'Несмотря на пышную шерсть, японский шпиц не требует сложного ухода. Достаточно расчесывать 2-3 раза в неделю специальной щеткой. В период линьки - чаще. Купать можно раз в 1-2 месяца.'
    },
    {
      question: 'Сколько живут японские шпицы?',
      answer: 'При правильном уходе и питании японские шпицы живут 12-16 лет. Это довольно здоровая порода с хорошим иммунитетом.'
    },
    {
      question: 'Подходит ли порода для квартиры?',
      answer: 'Да, японский шпиц прекрасно адаптируется к жизни в квартире. Они небольшие, чистоплотные и практически не пахнут. Главное - обеспечить достаточную физическую активность.'
    },
    {
      question: 'Что входит в стоимость щенка?',
      answer: 'В стоимость входят: щенок с документами РКФ, ветеринарный паспорт с прививками, чипирование, консультация по уходу, договор купли-продажи и корм на первое время.'
    }
  ]
  
  const testimonials = [
    {
      name: 'Анна М.',
      text: 'Взяли щенка 6 месяцев назад. Малыш адаптировался очень быстро, здоровый, активный. Спасибо питомнику за отличного питомца!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
    },
    {
      name: 'Дмитрий К.',
      text: 'Очень ответственный заводчик. Все документы в порядке, щенок привит по возрасту. Доставили в другой город без проблем.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
    },
    {
      name: 'Елена С.',
      text: 'Наш Айс - настоящий член семьи! Умный, послушный, красивый. Все дети в восторге. Рекомендую этот питомник!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
    }
  ]
  
  const { ref: heroRef, isInView: heroInView } = useScrollAnimation()
  const { ref: aboutRef, isInView: aboutInView } = useScrollAnimation()
  const { ref: puppiesRef, isInView: puppiesInView } = useScrollAnimation()
  
  return (;
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-40 border-b border-orange-100 shadow-sm">
        <nav className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <SafeIcon name="dog" size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black text-gray-900 tracking-tight">JapanSpitz</span>
                <span className="block text-xs text-orange-600 font-medium -mt-1">Питомник</span>
              </div>
            </a>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">О породе</a>
              <a href="#puppies" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Щенки</a>
              <a href="#faq" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">FAQ</a>
              <a href="#contacts" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Контакты</a>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsCallModalOpen(true)}
                className="hidden sm:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                <SafeIcon name="phone" size={18} />
                <span className="hidden lg:inline">Заказать звонок</span>
              </button>
              <a 
                href="#puppies"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-sm md:text-base transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
              >
                Выбрать щенка
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section ref={heroRef} className="pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <SafeIcon name="sparkles" size={16} />
                Помет 2024 года
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
                Японский <br />
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Шпиц</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Белоснежные облачка с чёрными глазками. Преданные компаньоны для всей семьи. Щенки с документами РКF от чемпионов.
              </p>
              
              {/* Countdown Timer */}
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-3 font-medium">До конца акции осталось:</p>
                <CountdownTimer />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <SafeIcon name="gift" size={20} />
                  Получить скидку 20%
                </button>
                <a 
                  href="#puppies"
                  className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-orange-300 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  <SafeIcon name="play-circle" size={20} className="text-orange-500" />
                  Смотреть щенков
                </a>
              </div>
              
              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                      <SafeIcon name="user" size={16} className="text-orange-600" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">500+</span> счастливых владельцев
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" 
                  alt="Японский шпиц"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-8 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <SafeIcon name="check-circle" size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Привиты</p>
                    <p className="text-sm text-gray-500">По возрасту</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute -top-4 -right-4 md:top-8 md:-right-8 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <SafeIcon name="award" size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">RKF/FCI</p>
                    <p className="text-sm text-gray-500">Документы</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-orange-50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4">
                  <SafeIcon name={feature.icon} size={28} className="text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT BREED SECTION */}
      <section id="about" ref={aboutRef} className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                О породе <span className="text-orange-600">Японский Шпиц</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Японский шпиц — это компактная, но крепкая собака с пышной белой шерстью и чёрными глазами. Их часто называют «улыбающимися собаками» за характерное выражение морды.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Эти собаки идеально подходят для жизни в квартире: они чистоплотны, не пахнут, легко обучаются и прекрасно ладят с детьми. Шпицы очень преданы своей семье и станут настоящими друзьями на многие годы.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-orange-50 rounded-2xl">
                  <div className="text-3xl font-black text-orange-600 mb-1">33-38</div>
                  <div className="text-sm text-gray-600">см в холке</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-2xl">
                  <div className="text-3xl font-black text-orange-600 mb-1">6-10</div>
                  <div className="text-sm text-gray-600">кг вес</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-2xl">
                  <div className="text-3xl font-black text-orange-600 mb-1">12-16</div>
                  <div className="text-sm text-gray-600">лет жизни</div>
                </div>
              </div>
              
              <a 
                href="#puppies"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold text-lg transition-colors"
              >
                Посмотреть доступных щенков
                <SafeIcon name="arrow-right" size={20} />
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&q=80" 
                      alt="Щенок японского шпица"
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80" 
                      alt="Японский шпиц играет"
                      className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&q=80" 
                      alt="Взрослый японский шпиц"
                      className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80" 
                      alt="Японский шпиц портрет"
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PUPPIES GALLERY SECTION */}
      <section id="puppies" ref={puppiesRef} className="py-16 md:py-24 px-4 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Доступны для бронирования
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                Наши <span className="text-orange-600">малыши</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Каждый щенок выращен с любовью и заботой. Все малыши привиты, имеют документы и готовы переехать в новый дом.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {puppies.map((puppy, index) => (
              <PuppyCard key={index} {...puppy} />
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button 
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              <SafeIcon name="bell" size={20} />
              Узнать о новых пометах
            </button>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Отзывы <span className="text-orange-600">владельцев</span>
            </h2>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-orange-100">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <SafeIcon key={i} name="star" size={24} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <img 
                      src={testimonials[currentTestimonial].image} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</p>
                      <p className="text-sm text-gray-500">Владелец японского шпица</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Часто задаваемые <span className="text-orange-600">вопросы</span>
            </h2>
            <p className="text-gray-600">
              Ответы на популярные вопросы о породе и покупке щенка
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-3xl p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contacts" className="py-16 md:py-24 px-4 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Свяжитесь с <span className="text-orange-600">нами</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Остались вопросы? Заполните форму, и мы перезвоним вам в ближайшее время. Или свяжитесь с нами напрямую через мессенджеры.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <SafeIcon name="phone" size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Телефон</p>
                    <p className="font-bold text-gray-900">+7 (999) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <SafeIcon name="mail" size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-bold text-gray-900">info@japan-spitz.ru</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <SafeIcon name="map-pin" size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Адрес</p>
                    <p className="font-bold text-gray-900">Москва, ул. Примерная, 123</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-3">Мы в соцсетях:</p>
                <div className="flex gap-3">
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <SafeIcon name="instagram" size={24} />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <SafeIcon name="send" size={24} />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <SafeIcon name="facebook" size={24} />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <SafeIcon name="youtube" size={24} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-orange-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Форма заявки</h3>
              <ContactForm accessKey={ACCESS_KEY} />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-4 telegram-safe-bottom">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <SafeIcon name="dog" size={24} className="text-white" />
                </div>
                <span className="text-xl font-black">JapanSpitz</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                Профессиональный питомник японских шпицев. Мы выращиваем здоровых, социализированных щенков с отличной родословной.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Навигация</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-orange-400 transition-colors">О породе</a></li>
                <li><a href="#puppies" className="hover:text-orange-400 transition-colors">Щенки</a></li>
                <li><a href="#faq" className="hover:text-orange-400 transition-colors">FAQ</a></li>
                <li><a href="#contacts" className="hover:text-orange-400 transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+7 (999) 123-45-67</li>
                <li>info@japan-spitz.ru</li>
                <li>Москва, Россия</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 JapanSpitz. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* CALL MODAL */}
      <Modal 
        isOpen={isCallModalOpen} 
        onClose={() => setIsCallModalOpen(false)}
        title="Заказать звонок"
      >
        <p className="text-gray-600 mb-6">
          Оставьте ваш номер телефона, и мы перезвоним вам в ближайшее время.
        </p>
        <ContactForm accessKey={ACCESS_KEY} compact />
      </Modal>

      {/* ORDER MODAL */}
      <Modal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)}
        title="Получить скидку 20%"
      >
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-orange-800 text-sm">
            <SafeIcon name="gift" size={16} className="inline mr-2" />
            При бронировании щенка до конца месяца вы получаете скидку 20% на покупку!
          </p>
        </div>
        <ContactForm accessKey={ACCESS_KEY} />
      </Modal>
    </div>
  )
}

export default App;