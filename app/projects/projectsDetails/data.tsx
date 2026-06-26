import React from 'react'

export interface Project {
  id: string
  title: string
  category: string
  description: string | React.ReactNode
  image: string
  tags: string[]
}

export const projects: Project[] = [
  {
    id: 'nova-finance',
    title: 'Nova Finance Platform',
    category: 'Fintech',
    description: (
      <div>
        <p style={{ color: '#4e5461' }}>Nova Finance Platform is a modern banking interface that revolutionizes how users interact with their finances. By combining intuitive design with advanced financial technology, it provides a seamless experience for managing personal finances, investments, and banking services.</p>
        
        <h3>Intuitive and Minimalist User Interface</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Clean Dashboard:</strong> Overview of key financial metrics and recent activities</li>
          <li style={{ color: '#4e5461' }}><strong>2. Smart Navigation:</strong> Context-aware menu system that adapts to user behavior</li>
          <li style={{ color: '#4e5461' }}><strong>3. Visual Analytics:</strong> Interactive charts and graphs for financial data visualization</li>
          <li style={{ color: '#4e5461' }}><strong>4. Financial Health Score:</strong> Comprehensive assessment of user's financial status with improvement suggestions</li>
        </ul>
        
        <h3>Advanced Financial Analysis Functions</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Real-time Expense Categorization and Tracking:</strong> Automatically categorize transactions and generate intuitive charts</li>
          <li style={{ color: '#4e5461' }}><strong>2. Predictive Financial Models:</strong> Forecast future expenditures and saving trends based on consumption patterns</li>
          <li style={{ color: '#4e5461' }}><strong>3. Contextual Comparative Analysis:</strong> Compare spending habits with peers, industry counterparts, or custom groups</li>
          <li style={{ color: '#4e5461' }}><strong>4. Financial Health Score:</strong> Comprehensive assessment of user's financial status with improvement suggestions</li>
        </ul>
        
        <p style={{ color: '#4e5461' }}>This modern banking interface represents the transformation of financial services from transaction processing to comprehensive financial advisory, empowering users through technology to make smarter financial decisions and achieve personal wealth goals.</p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['Fintech', 'React', 'Node.js', 'Banking']
  },
  {
    id: 'eco-habitat',
    title: 'Eco Habitat',
    category: 'Brand Identity',
    description: (
      <div>
        <p style={{ color: '#4e5461' }}>Eco Habitat is a comprehensive brand identity project focused on sustainable housing initiatives. By combining eco-conscious design principles with community-focused messaging, it creates a powerful visual language that resonates with environmentally conscious consumers and promotes sustainable living practices.</p>
        
        <h3>Brand Design System</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Visual Identity:</strong> Eco-friendly color palette and typography</li>
          <li style={{ color: '#4e5461' }}><strong>2. Logo Design:</strong> Sustainable and modern brand mark</li>
          <li style={{ color: '#4e5461' }}><strong>3. Design Guidelines:</strong> Comprehensive brand style guide</li>
          <li style={{ color: '#4e5461' }}><strong>4. Brand Collateral:</strong> Consistent application across all touchpoints</li>
        </ul>
        
        <h3>Material Guidelines</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Sustainable Materials:</strong> Eco-friendly printing and production options</li>
          <li style={{ color: '#4e5461' }}><strong>2. Packaging Design:</strong> Minimal waste packaging solutions</li>
          <li style={{ color: '#4e5461' }}><strong>3. Digital Assets:</strong> Optimized for various platforms</li>
          <li style={{ color: '#4e5461' }}><strong>4. Brand Collateral:</strong> Consistent application across all touchpoints</li>
        </ul>
        
        <p style={{ color: '#4e5461' }}>Eco Habitat's brand identity represents a commitment to sustainable living, creating a visual language that inspires and engages communities while promoting environmental consciousness.</p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/2469122/pexels-photo-2469122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['Branding', 'Logo Design', 'Sustainability']
  },
  {
    id: 'pulse-fitness',
    title: 'Pulse Fitness App',
    category: 'Mobile Development',
    description: (
      <div>
        <p style={{ color: '#4e5461' }}>Pulse Fitness App is a comprehensive mobile fitness solution that combines personalized workout tracking, nutrition guidance, and social features to create an engaging fitness experience. By leveraging mobile technology and data analytics, it provides users with a convenient and effective way to achieve their fitness goals.</p>
        
        <h3>Workout Management</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Custom Routines:</strong> Personalized workout plans and exercises</li>
          <li style={{ color: '#4e5461' }}><strong>2. Exercise Library:</strong> Comprehensive database of workouts</li>
          <li style={{ color: '#4e5461' }}><strong>3. Progress Tracking:</strong> Detailed performance monitoring</li>
          <li style={{ color: '#4e5461' }}><strong>4. Workout Scheduling:</strong> Smart planning and reminders</li>
        </ul>
        
        <h3>Nutrition Tracking</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Meal Planning:</strong> Personalized nutrition guidance</li>
          <li style={{ color: '#4e5461' }}><strong>2. Food Logging:</strong> Easy calorie and macro tracking</li>
          <li style={{ color: '#4e5461' }}><strong>3. Recipe Database:</strong> Healthy meal suggestions</li>
          <li style={{ color: '#4e5461' }}><strong>4. Hydration Monitoring:</strong> Water intake tracking</li>
        </ul>
        
        <p style={{ color: '#4e5461' }}>Pulse Fitness App transforms the fitness experience by making it more accessible, engaging, and effective through innovative mobile technology and comprehensive tracking features.</p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/1103242/pexels-photo-1103242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['React Native', 'Health Tech', 'UX Design']
  },
  {
    id: 'artisan-cafe',
    title: 'Artisan Café',
    category: 'Brand Identity',
    description: (
      <div>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Logo System:</strong> Primary and secondary marks with versatile applications</li>
          <li style={{ color: '#4e5461' }}><strong>2. Color Palette:</strong> Strategic color selection conveying brand personality</li>
          <li style={{ color: '#4e5461' }}><strong>3. Typography Hierarchy:</strong> Distinctive and functional font families</li>
          <li style={{ color: '#4e5461' }}><strong>4. Visual Language:</strong> Imagery style, iconography, and graphic elements</li>
        </ul>
        
        <h3>Brand Expression Guidelines</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Brand Voice:</strong> Tone, personality, and communication principles</li>
          <li style={{ color: '#4e5461' }}><strong>2. Implementation Standards:</strong> Consistent application across all touchpoints</li>
          <li style={{ color: '#4e5461' }}><strong>3. Digital Experience:</strong> UI/UX guidelines for digital platforms</li>
          <li style={{ color: '#4e5461' }}><strong>4. Brand Evolution:</strong> Framework for growth while maintaining recognition</li>
        </ul>
        
        <p style={{ color: '#4e5461' }}>A successful Brand Identity serves as the foundation for all brand interactions, creating emotional connections with audiences while establishing trust and recognition that drives business value and fosters lasting customer relationships.</p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/302902/pexels-photo-302902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['Branding', 'Interior Design', 'Hospitality']
  },
  {
    id: 'nomad-travel',
    title: 'Nomad Travel Platform',
    category: 'Web Development',
    description: (
      <div>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Destination Intelligence:</strong> Climate, cost of living, and visa requirement analytics</li>
          <li style={{ color: '#4e5461' }}><strong>2. Workspace Finder:</strong> Curated coworking spaces with connectivity ratings</li>
          <li style={{ color: '#4e5461' }}><strong>3. Accommodation Matchmaking:</strong> Nomad-friendly housing with flexible terms</li>
          <li style={{ color: '#4e5461' }}><strong>4. Travel Logistics:</strong> Integrated transportation and relocation planning</li>
        </ul>
        
        <h3>Community & Lifestyle Support</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Nomad Networking:</strong> Location-based community connections and events</li>
          <li style={{ color: '#4e5461' }}><strong>2. Knowledge Exchange:</strong> Destination guides and local insights</li>
          <li style={{ color: '#4e5461' }}><strong>3. Remote Work Resources:</strong> Time zone management and productivity tools</li>
          <li style={{ color: '#4e5461' }}><strong>4. Wellbeing Services:</strong> Health resources and work-life balance support</li>
        </ul>
        
        <p style={{ color: '#4e5461' }}>The Nomad Travel Platform serves as a comprehensive companion for the modern location-independent lifestyle, bridging the gap between travel aspirations and practical realities while fostering a global community of like-minded professionals seeking freedom, growth, and authentic experiences.</p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/7625308/pexels-photo-7625308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['Next.js', 'Travel Tech', 'UI Design']
  },
  {
    id: 'summit-events',
    title: 'Summit Events',
    category: 'Digital Marketing',
    description: (
      <div>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Audience Intelligence:</strong> Behavioral analysis and segmentation methodologies</li>
          <li style={{ color: '#4e5461' }}><strong>2. Channel Optimization:</strong> Cross-platform strategy and budget allocation</li>
          <li style={{ color: '#4e5461' }}><strong>3. Content Ecosystem:</strong> Integrated storytelling and content journey mapping</li>
          <li style={{ color: '#4e5461' }}><strong>4. Performance Analytics:</strong> ROI measurement and attribution modeling</li>
        </ul>
        
        <h3>Tactical Implementation Elements</h3>
        <ul>
          <li style={{ color: '#4e5461' }}><strong>1. Search Marketing:</strong> SEO fundamentals and paid search campaign management</li>
          <li style={{ color: '#4e5461' }}><strong>2. Social Media Engagement:</strong> Platform-specific strategies and community building</li>
          <li style={{ color: '#4e5461' }}><strong>3. Conversion Optimization:</strong> Landing page design and funnel analysis</li>
          <li style={{ color: '#4e5461' }}><strong>4. Marketing Automation:</strong> Personalized customer journeys and nurture workflows</li>
        </ul>
        
        <p style={{ color: '#4e5461' }}>Effective Digital Marketing transcends individual tactics to create cohesive brand experiences across the customer lifecycle, combining creativity with analytical precision to generate measurable business outcomes while adapting to rapidly evolving technologies and consumer behaviors in the digital landscape.</p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['Digital Marketing', 'Event', 'Web Design']
  }
] 